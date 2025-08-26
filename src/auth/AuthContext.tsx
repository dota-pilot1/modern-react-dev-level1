import React, { createContext, useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export interface User {
  username: string
}

export interface AuthContextValue {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('demo_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username: string, _password: string) => {
    const fakeUser = { username }
    localStorage.setItem('demo_user', JSON.stringify(fakeUser))
    setUser(fakeUser)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('demo_user')
    setUser(null)
    navigate('/login')
  }, [navigate])

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
