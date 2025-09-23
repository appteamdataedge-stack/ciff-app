import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type User = {
  username: string
  role: string
  name: string
}

type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  
  // Check localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('user')
      }
    }
  }, [])
  
  const login = async (username: string, password: string) => {
    // Simulate API call
    if (username === 'admin' && password === 'password') {
      const userData: User = {
        username: 'admin',
        role: 'Banking Admin',
        name: 'Admin'
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return true
    }
    return false
  }
  
  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }
  
  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!user,
      user,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
