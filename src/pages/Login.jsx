import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const { login } = useAuth()

    const testAccounts = [
        { email: "admin@acme.test", role: "Admin", tenant: "Acme" },
        { email: "user@acme.test", role: "Member", tenant: "Acme" },
        { email: "admin@globex.test", role: "Admin", tenant: "Globex" },
        { email: "user@globex.test", role: "Member", tenant: "Globex" },
    ]

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const result = await login(email, password)

        if (!result.success) {
            setError(result.error)
        }

        setLoading(false)
    }

    const handleTestLogin = (testEmail) => {
        setEmail(testEmail)
        setPassword("password")
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">Sign in to SaaS Notes</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Multi-tenant notes application</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="alert alert-error">{error}</div>}

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:border-blue-500"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg mt-1 focus:border-blue-500"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button type="submit" disabled={loading} className="inline-flex items-center justify-center w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </div>
                </form>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Test Accounts</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-3">
                        {testAccounts.map((account) => (
                            <button
                                key={account.email}
                                type="button"
                                onClick={() => handleTestLogin(account.email)}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">{account.email}</div>
                                    <div className="text-xs text-gray-500">
                                        {account.role} • {account.tenant}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-500">
                        All test accounts use password: <code className="bg-gray-100 px-1 rounded">password</code>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
