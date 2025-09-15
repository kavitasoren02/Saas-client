import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Dashboard = () => {
    const { user, getAuthHeaders, API_BASE_URL } = useAuth()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [upgrading, setUpgrading] = useState(false)
    const [upgradeMessage, setUpgradeMessage] = useState("")

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/tenants/${user.tenant.slug}/stats`, {
                headers: getAuthHeaders(),
            })

            if (response.ok) {
                const data = await response.json()
                setStats(data.stats)
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleUpgrade = async () => {
        setUpgrading(true)
        setUpgradeMessage("")

        try {
            const response = await fetch(`${API_BASE_URL}/tenants/${user.tenant.slug}/upgrade`, {
                method: "POST",
                headers: getAuthHeaders(),
            })

            const data = await response.json()

            if (response.ok) {
                setUpgradeMessage("Successfully upgraded to Pro plan!")
                // Refresh the page to update user data
                setTimeout(() => window.location.reload(), 1500)
            } else {
                setUpgradeMessage(data.error || "Failed to upgrade")
            }
        } catch (error) {
            setUpgradeMessage("Network error. Please try again.")
        } finally {
            setUpgrading(false)
        }
    }

    const isFreePlan = user?.tenant?.plan === "free"
    const isAdmin = user?.role === "admin"

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <div className="text-sm text-gray-500">Welcome back, {user?.email}</div>
            </div>

            {/* Tenant Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">{user?.tenant?.name}</h2>
                </div>
                <div className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <div className="text-sm text-gray-500">Plan</div>
                            <div className="text-lg font-medium capitalize">
                                {user?.tenant?.plan}
                                {isFreePlan && (
                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                        Limited
                                    </span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Role</div>
                            <div className="text-lg font-medium capitalize">{user?.role}</div>
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">Note Limit</div>
                            <div className="text-lg font-medium">
                                {user?.tenant?.maxNotes === -1 ? "Unlimited" : user?.tenant?.maxNotes}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Card */}
            {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="px-6 py-4">
                        <div className="animate-pulse flex space-x-4">
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                stats && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-6 py-4">
                            <h2 className="text-lg font-semibold text-gray-900">Statistics</h2>
                        </div>
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Total Users</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.users}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Total Notes</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.notes}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Notes Remaining</div>
                                    <div className="text-2xl font-bold text-gray-900">{stats.notesRemaining}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
                )}

            {/* Upgrade Card - Only show for Free plan admins */}
            {isFreePlan && isAdmin && (
                <div className="bg-yellow-50 rounded-lg shadow-sm border border-yellow-200">
                    <div className="px-6 py-4">
                        <h2 className="text-lg font-semibold text-yellow-800">Upgrade to Pro</h2>
                    </div>
                    <div className="px-6 py-4">
                        <p className="text-yellow-700 mb-4">
                            Your tenant is currently on the Free plan with a limit of {user?.tenant?.maxNotes} notes. Upgrade to Pro
                            for unlimited notes and additional features.
                        </p>

                        {upgradeMessage && (
                            <div className={`mb-4 ${upgradeMessage.includes("Successfully") ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>{upgradeMessage}</div>
                        )}

                        <button onClick={handleUpgrade} disabled={upgrading} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                            {upgrading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Upgrading...
                                </div>
                            ) : (
                                "Upgrade to Pro"
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                </div>
                <div className="px-6 py-4">
                    <div className="flex flex-wrap gap-4">
                        <Link to="/notes" className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                            View Notes
                        </Link>
                        {isAdmin && (
                            <button
                                onClick={() => alert("User invitation feature would be implemented here")}
                                className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200"
                            >
                                Invite User
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
