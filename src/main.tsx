import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import RootLayout from './modules/layout/RootLayout'
import CustomerPage from './modules/customers/CustomerPage'
import AccountPage from './modules/accounts/AccountPage'
import DashboardPage from './modules/dashboard/DashboardPage'
import LoginPage from './modules/auth/LoginPage'
import { AuthProvider, useAuth } from './shared/auth/AuthContext'

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute><RootLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'customers', element: <CustomerPage /> },
      { path: 'accounts', element: <AccountPage /> },
      // Removed Products, SubProducts, OfficeAccounts, and Transactions routes
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
