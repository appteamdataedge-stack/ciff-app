import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AlertProvider } from '../../shared/alerts/AlertContext'
import AlertToaster from '../../shared/alerts/AlertToaster'
import { useAuth } from '../../shared/auth/AuthContext'

function RootLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <AlertProvider>
      <div className="min-h-screen grid grid-cols-[240px_1fr] grid-rows-[56px_1fr]">
        {/* Sidebar */}
        <aside className="row-span-2 bg-white border-r border-gray-200">
          <div className="h-14 flex items-center px-4 border-b bg-primary text-white">
            <Link to="/" className="font-semibold">
              CBS Money Market
            </Link>
          </div>

          <nav className="p-2 space-y-1">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? 'bg-primary-light text-primary font-medium' : 'hover:bg-gray-50'
                }`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/customers"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? 'bg-primary-light text-primary font-medium' : 'hover:bg-gray-50'
                }`
              }
            >
              Customers
            </NavLink>
            <NavLink
              to="/accounts"
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md ${
                  isActive ? 'bg-primary-light text-primary font-medium' : 'hover:bg-gray-50'
                }`
              }
            >
              Accounts
            </NavLink>
          </nav>
        </aside>

        {/* Header */}
        <header className="col-start-2 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
          <div className="text-sm text-primary font-medium">
            Futaric Banking System
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-primary text-white rounded-full h-8 w-8 flex items-center justify-center font-semibold">
                {user?.name?.charAt(0) || 'A'}
              </span>
              <div className="text-sm">
                <div className="font-medium">{user?.name || 'Admin'}</div>
                <div className="text-xs text-gray-500">{user?.role || 'Banking Admin'}</div>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="text-sm text-gray-600 hover:text-primary"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="col-start-2 p-6 bg-gray-50">
          <Outlet />
        </main>
        <AlertToaster />
      </div>
    </AlertProvider>
  )
}

export default RootLayout
