import { Card, CardBody, CardHeader } from '../../shared/ui/Card'
import { Table, THead, TH, TRow, TD } from '../../shared/ui/Table'
import customersData from '../../data/customers.json'
import { storage } from '../../services/storage'

// Sample chart component - normally this would use a charting library
const ChartBar = ({ value, maxValue, color }: { value: number, maxValue: number, color: string }) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100))
  return (
    <div className="h-3 w-full bg-gray-100 rounded-full">
      <div 
        className={`h-full rounded-full ${color}`} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

function DashboardPage() {
  // Get data from localStorage and JSON files
  const storedCustomers = storage.getList<any>('customers')
  const allCustomers = [...customersData.customers, ...storedCustomers]
  const storedAccounts = storage.getList<any>('accounts')
  const allAccounts = [...storedAccounts]
  
  // Calculate some stats for display
  const totalCustomers = allCustomers.length
  const totalAccounts = allAccounts.length
  const recentCustomers = [...allCustomers].sort((a, b) => {
    return (b.createdAt || '2023-01-01') > (a.createdAt || '2023-01-01') ? 1 : -1
  }).slice(0, 5)
  const recentAccounts = [...allAccounts].sort((a, b) => {
    return (b.createdAt || '2023-01-01') > (a.createdAt || '2023-01-01') ? 1 : -1
  }).slice(0, 5)
  
  // Mock data for charts
  const customerTypes = {
    individual: allCustomers.filter(c => c.custType === 'Individual').length,
    corporate: allCustomers.filter(c => c.custType === 'Corporate').length,
    bank: allCustomers.filter(c => c.custType === 'Bank').length,
  }
  
  const monthlyData = [
    { month: 'Jan', customers: 2, accounts: 3 },
    { month: 'Feb', customers: 4, accounts: 5 },
    { month: 'Mar', customers: 3, accounts: 2 },
    { month: 'Apr', customers: 5, accounts: 7 },
    { month: 'May', customers: 7, accounts: 6 },
    { month: 'Jun', customers: 8, accounts: 9 },
  ]
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary-light">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Customers</div>
              <div className="text-2xl font-semibold text-gray-800">{totalCustomers}</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Total Accounts</div>
              <div className="text-2xl font-semibold text-gray-800">{totalAccounts}</div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">Active Accounts</div>
              <div className="text-2xl font-semibold text-gray-800">
                {allAccounts.filter(a => a.status === 'Active').length}
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-yellow-50">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500">New This Month</div>
              <div className="text-2xl font-semibold text-gray-800">
                {allCustomers.length > 0 ? allCustomers.length : 0}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Customer Types</CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Individual</div>
                <div className="text-sm text-gray-500">{customerTypes.individual}</div>
              </div>
              <ChartBar value={customerTypes.individual} maxValue={totalCustomers || 1} color="bg-primary" />
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Corporate</div>
                <div className="text-sm text-gray-500">{customerTypes.corporate}</div>
              </div>
              <ChartBar value={customerTypes.corporate} maxValue={totalCustomers || 1} color="bg-blue-500" />
              
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Bank</div>
                <div className="text-sm text-gray-500">{customerTypes.bank}</div>
              </div>
              <ChartBar value={customerTypes.bank} maxValue={totalCustomers || 1} color="bg-green-500" />
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>Monthly Growth</CardHeader>
          <CardBody>
            <div className="h-64 flex items-end justify-between">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="flex flex-col space-y-1">
                    <div className="w-10 bg-primary" style={{ height: `${data.customers * 8}px` }}></div>
                    <div className="w-10 bg-blue-400" style={{ height: `${data.accounts * 8}px` }}></div>
                  </div>
                  <div className="text-xs text-gray-500">{data.month}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary"></div>
                <div className="text-xs">Customers</div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400"></div>
                <div className="text-xs">Accounts</div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>Recently Created Customers</CardHeader>
          <CardBody>
            <Table>
              <THead>
                <TRow>
                  <TH>ID</TH>
                  <TH>Name</TH>
                  <TH>Type</TH>
                </TRow>
              </THead>
              <tbody>
                {recentCustomers.length > 0 ? (
                  recentCustomers.map((customer) => (
                    <TRow key={customer.id}>
                      <TD>{customer.id}</TD>
                      <TD>{customer.firstName ? `${customer.firstName} ${customer.lastName}` : customer.tradeName}</TD>
                      <TD>{customer.custType}</TD>
                    </TRow>
                  ))
                ) : (
                  <TRow>
                    <TD colSpan={3} className="text-center py-4 text-gray-500">No customers found</TD>
                  </TRow>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
        
        <Card>
          <CardHeader>Recently Created Accounts</CardHeader>
          <CardBody>
            <Table>
              <THead>
                <TRow>
                  <TH>Account No</TH>
                  <TH>Customer</TH>
                  <TH>Status</TH>
                </TRow>
              </THead>
              <tbody>
                {recentAccounts.length > 0 ? (
                  recentAccounts.map((account) => (
                    <TRow key={account.id}>
                      <TD>{account.accountNo || '—'}</TD>
                      <TD>{account.customerName || account.custId}</TD>
                      <TD>{account.status}</TD>
                    </TRow>
                  ))
                ) : (
                  <TRow>
                    <TD colSpan={3} className="text-center py-4 text-gray-500">No accounts found</TD>
                  </TRow>
                )}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default DashboardPage

