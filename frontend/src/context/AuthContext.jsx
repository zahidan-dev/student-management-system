import { createContext, useContext, useEffect, useState } from 'react'
import {
  loginAdmin,
  getCurrentAdmin,
  logoutAdmin
} from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentAdmin()
        setAdmin(response.data)
      } catch {
        setAdmin(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    const response = await loginAdmin(email, password)
    setAdmin(response.data)
    return response
  }

  const logout = async () => {
    await logoutAdmin()
    setAdmin(null)
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        isAuthenticated: !!admin,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}