import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../shared/auth/AuthContext'
import Button from '../../shared/ui/Button'
import Input from '../../shared/ui/Input'
import Label from '../../shared/ui/Label'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, login } = useAuth()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const success = await login(username, password)
      if (!success) {
        setError('Invalid username or password')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  
  return (
    <div className="h-screen flex items-center justify-center bg-primary-light">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-center mb-6">
          <img src="/dataedge-logon.png" alt="Logo" className="h-12" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-6 text-primary">SDMS Application</h1>
        
        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-opacity-90" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          {/* <p>Use username: admin / password: password</p> */}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
