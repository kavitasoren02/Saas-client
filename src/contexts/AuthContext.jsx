import React, { createContext, useContext, useState, useEffect } from "react"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check for existing token on mount
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            fetchCurrentUser(token)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchCurrentUser = async (token) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                const data = await response.json()
                setUser(data.user)
            } else {
                localStorage.removeItem("token")
            }
        } catch (error) {
            console.error("Failed to fetch current user:", error)
            localStorage.removeItem("token")
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem("token", data.token)
                setUser(data.user)
                return { success: true }
            } else {
                return { success: false, error: data.error }
            }
        } catch (error) {
            console.error("Login error:", error)
            return { success: false, error: "Network error. Please try again." }
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
    }

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token")
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    const value = {
        user,
        loading,
        login,
        logout,
        getAuthHeaders,
        API_BASE_URL,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}