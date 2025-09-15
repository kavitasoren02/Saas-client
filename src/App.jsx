import { useState } from 'react'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicRoute } from './utils/ProtectedRoutes'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Notes from './pages/Notes'

function App() {

  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="notes" element={<Notes />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
