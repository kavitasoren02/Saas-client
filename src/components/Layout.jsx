import { Outlet, Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Layout = () => {
    const { user, logout } = useAuth()
    const location = useLocation()

    const navigation = [
        { name: "Dashboard", href: "/dashboard" },
        { name: "Notes", href: "/notes" },
    ]

    const isActive = (href) => location.pathname === href

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-xl font-bold text-gray-900">SaaS Notes</h1>
                            </div>
                            <div className="ml-10 flex space-x-8">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors ${isActive(item.href)
                                                ? "border-blue-500 text-gray-900"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{user?.tenant?.name}</span>
                                <span className="mx-2">•</span>
                                <span className="capitalize">{user?.tenant?.plan} Plan</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                {user?.email} ({user?.role})
                            </div>
                            <button
                                onClick={logout}
                                className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-900 hover:bg-gray-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
