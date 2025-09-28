import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user data on app start
    const checkAuthState = () => {
      try {
        const storedUser = localStorage.getItem('zidio_user')
        const storedToken = localStorage.getItem('zidio_token')
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error checking auth state:', error)
        // Clear invalid stored data
        localStorage.removeItem('zidio_user')
        localStorage.removeItem('zidio_token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthState()
  }, [])

  const login = (userData, token = 'demo_token') => {
    try {
      setUser(userData)
      localStorage.setItem('zidio_user', JSON.stringify(userData))
      localStorage.setItem('zidio_token', token)
    } catch (error) {
      console.error('Error during login:', error)
      throw new Error('Failed to save login information')
    }
  }

  const logout = () => {
    try {
      setUser(null)
      localStorage.removeItem('zidio_user')
      localStorage.removeItem('zidio_token')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const updateUser = (updatedData) => {
    try {
      const newUserData = { ...user, ...updatedData }
      setUser(newUserData)
      localStorage.setItem('zidio_user', JSON.stringify(newUserData))
    } catch (error) {
      console.error('Error updating user:', error)
      throw new Error('Failed to update user information')
    }
  }

  const value = {
    user,
    login,
    logout,
    updateUser,
    isLoading,
    isAuthenticated: !!user
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading ZIDIO Connect...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext }