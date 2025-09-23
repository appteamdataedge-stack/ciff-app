import { useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from '../../shared/ui/Card'
import Button from '../../shared/ui/Button'
import Input from '../../shared/ui/Input'
import Label from '../../shared/ui/Label'
import Select from '../../shared/ui/Select'
import { Table, THead, TH, TRow, TD } from '../../shared/ui/Table'
import Badge from '../../shared/ui/Badge'
import Tabs from '../../shared/ui/Tabs'
import customersData from '../../data/customers.json'
import productsData from '../../data/products.json'
import { useAlerts } from '../../shared/alerts/AlertContext'
import { storage } from '../../services/storage'
import Modal from '../../shared/ui/Modal'

function AccountPage() {
  const { push } = useAlerts()
  
  // Account Form State
  const [form, setForm] = useState({
    custId: '',
    productId: '',
    subProductId: '',
    accountNo: '',
    tenor: '',
    maturity: '',
    glNum: '',
    cifNo: '',
    customerName: '',
    accountName: '',
    branchCode: '',
    openedOn: new Date().toISOString().slice(0, 10),
    status: 'Active',
    balance: Math.floor(Math.random() * 10000) / 100,
    currency: 'USD',
    createdAt: new Date().toISOString()
  })
  
  // UI States
  const [searchAccountNo, setSearchAccountNo] = useState('')
  const [selectedAccount, setSelectedAccount] = useState<any>(null)
  const [viewAccount, setViewAccount] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [lookupCustomer, setLookupCustomer] = useState<any>(null)
  const [uploadedFile, setUploadedFile] = useState<{name: string, size: string} | null>(null)
  
  // Get combined customers and accounts
  const storedCustomers = storage.getList<any>('customers')
  const allCustomers = [...customersData.customers, ...storedCustomers]
  const storedAccounts = storage.getList<any>('accounts')
  const allAccounts = [...storedAccounts]
  
  // Reset form
  const resetForm = () => {
    setForm({
      custId: '',
      productId: '',
      subProductId: '',
      accountNo: '',
      tenor: '',
      maturity: '',
      glNum: '',
      cifNo: '',
      customerName: '',
      accountName: '',
      branchCode: '',
      openedOn: new Date().toISOString().slice(0, 10),
      status: 'Active',
      balance: Math.floor(Math.random() * 10000) / 100,
      currency: 'USD',
      createdAt: new Date().toISOString()
    })
    setLookupCustomer(null)
    setUploadedFile(null)
  }
  
  // Search for an account by number
  const searchByAccountNo = () => {
    const found = allAccounts.find(a => a.accountNo === searchAccountNo)
    if (found) {
      setSelectedAccount(found)
      setEditForm(found)
      push('info', `Account found: ${found.accountNo}`)
    } else {
      push('error', `No account found with Account No: ${searchAccountNo}`)
    }
  }
  
  // Look up customer by ID
  const fetchCustomerById = () => {
    if (!form.custId) {
      push('error', 'Please select a customer ID first')
      return
    }
    
    const customer = allCustomers.find(c => c.id === form.custId)
    if (customer) {
      setLookupCustomer(customer)
      setForm({
        ...form,
        customerName: customer.firstName 
          ? `${customer.firstName} ${customer.lastName}` 
          : customer.tradeName,
        cifNo: customer.externalCif || form.cifNo
      })
      push('info', 'Customer information loaded')
    } else {
      push('error', 'Customer not found')
    }
  }
  
  // Generate account number
  const generateAccountNumber = () => {
    if (!form.custId || !form.subProductId) {
      push('error', 'Please select Customer and Sub-Product first')
      return
    }
    
    const accountNo = '001-' + Math.floor(Math.random()*1000000).toString().padStart(6, '0')
    setForm({ ...form, accountNo })
    push('info', `Account number generated: ${accountNo}`)
  }
  
  // Create account
  const createAccount = () => {
    // Validation
    if (!form.accountName || !form.branchCode || !form.accountNo) {
      push('error', 'Please fill all required fields and generate an account number')
      return
    }
    
    const id = 'ACC-' + Math.random().toString(36).slice(2,8).toUpperCase()
    const record = {
      id,
      ...form,
      createdAt: new Date().toISOString(),
      // Add document info if available
      document: uploadedFile ? {
        name: uploadedFile.name,
        size: uploadedFile.size,
        uploadDate: new Date().toISOString()
      } : null
    }
    
    storage.addItem('accounts', record)
    push('success', `Account created with ID: ${id}`)
    resetForm()
  }
  
  // Update account
  const updateAccount = () => {
    const accounts = storage.getList<any>('accounts')
    const updatedAccounts = accounts.map(a => 
      a.id === editForm.id ? editForm : a
    )
    storage.setList('accounts', updatedAccounts)
    push('success', 'Account updated successfully')
    setIsEditModalOpen(false)
    setSelectedAccount(null)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Account Management</h1>
        <Badge color="primary">Numbering & Lifecycle</Badge>
      </div>

      <Tabs tabs={[
        { id: 'create', label: 'Create', content: (
          <Card>
            {/* <CardHeader className="bg-primary-light flex justify-between items-center px-6">
              <span className="text-lg font-medium">Create Account</span>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="account-document"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      const fileName = file.name;
                      const fileSize = (file.size / 1024).toFixed(2) + ' KB';
                      
                      // Set the uploaded file info
                      setUploadedFile({ name: fileName, size: fileSize });
                      
                      // In a real app, you would handle the file upload to a server here
                      setTimeout(() => {
                        push('success', `File "${fileName}" uploaded successfully`);
                      }, 500);
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label htmlFor="account-document" className="cursor-pointer flex items-center gap-2 bg-white hover:bg-gray-50 text-primary px-4 py-1.5 text-sm rounded-md border border-primary ml-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  Upload Document
                </label>
              </div>
            </CardHeader> */}
            <div className="relative">
              <CardHeader className="bg-primary-light px-6">
                <span className="text-lg font-medium">Create Account</span>
              </CardHeader>
              
              {/* Absolute positioned upload button */}
              <div className="absolute top-3 right-6">
                <input
                  type="file"
                  id="account-document"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      const fileName = file.name;
                      const fileSize = (file.size / 1024).toFixed(2) + ' KB';
                      
                      // Set the uploaded file info
                      setUploadedFile({ name: fileName, size: fileSize });
                      
                      // Simulate upload success
                      setTimeout(() => {
                        push('success', `File "${fileName}" uploaded successfully`);
                      }, 500);
                    }
                  }}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="account-document"
                  className="cursor-pointer flex items-center gap-2 bg-white hover:bg-gray-50 text-primary px-4 py-1.5 text-sm rounded-md border border-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Upload Document
                </label>
              </div>
            </div>

            <CardBody>
              {/* Uploaded Document Display */}
              {uploadedFile && (
                <div className="mb-4 p-3 border border-primary-light rounded-md bg-primary-light/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-medium text-sm">{uploadedFile.name}</div>
                        <div className="text-xs text-gray-500">{uploadedFile.size}</div>
                      </div>
                    </div>
                    <button 
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setUploadedFile(null)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Customer Selection */}
              <div className="mb-6 p-4 border rounded-md bg-gray-50">
                <h3 className="text-sm font-semibold mb-3 text-gray-700">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div className="space-y-1.5">
                    <Label required>Customer ID</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={form.custId} 
                        onChange={(e) => setForm({ ...form, custId: e.target.value })}
                      >
                        <option value="">Select...</option>
                        {allCustomers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.id} - {c.firstName ? `${c.firstName} ${c.lastName}` : c.tradeName}
                          </option>
                        ))}
                      </Select>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={fetchCustomerById}
                        disabled={!form.custId}
                        className="whitespace-nowrap"
                      >
                        Lookup
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label>Customer Name</Label>
                    <Input 
                      value={form.customerName} 
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      disabled={!!lookupCustomer}
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label>External CIF</Label>
                    <Input 
                      value={form.cifNo} 
                      onChange={(e) => setForm({ ...form, cifNo: e.target.value })}
                      disabled={!!lookupCustomer} 
                    />
                  </div>
                </div>
                
                {lookupCustomer && (
                  <div className="bg-white p-3 rounded-md border border-primary-light">
                    <div className="text-sm text-primary font-medium mb-2">Selected Customer Details</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Type:</span> {lookupCustomer.custType}
                      </div>
                      {lookupCustomer.mobile && (
                        <div>
                          <span className="text-gray-500">Mobile:</span> {lookupCustomer.mobile}
                        </div>
                      )}
                      {lookupCustomer.email && (
                        <div>
                          <span className="text-gray-500">Email:</span> {lookupCustomer.email}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Account Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label required>Account Name</Label>
                  <Input 
                    required 
                    value={form.accountName} 
                    onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label required>Branch Code</Label>
                  <Input 
                    required 
                    value={form.branchCode} 
                    onChange={(e) => setForm({ ...form, branchCode: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label>Account Number</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Auto-generated" 
                      disabled 
                      value={form.accountNo}
                    />
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={generateAccountNumber}
                      disabled={!form.custId || !form.subProductId}
                      className="whitespace-nowrap"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select 
                    value={form.status} 
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Deactivated</option>
                    <option>Pending</option>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select 
                    value={form.currency} 
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                    <option>JPY</option>
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label>Opening Balance</Label>
                  <Input 
                    type="number"
                    value={form.balance} 
                    onChange={(e) => setForm({ ...form, balance: parseFloat(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label required>Product</Label>
                  <Select 
                    value={form.productId} 
                    onChange={(e) => setForm({ ...form, productId: e.target.value, subProductId: '' })}
                  >
                    <option value="">Select...</option>
                    {productsData.products.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label required>Sub-Product</Label>
                  <Select 
                    value={form.subProductId} 
                    onChange={(e) => setForm({ ...form, subProductId: e.target.value })}
                    disabled={!form.productId}
                  >
                    <option value="">Select...</option>
                    {productsData.subProducts
                      .filter(sp => !form.productId || sp.productId === form.productId)
                      .map((sp) => (
                        <option key={sp.id} value={sp.id}>{sp.name}</option>
                      ))
                    }
                  </Select>
                </div>
                
                <div className="space-y-1.5">
                  <Label>Tenor (days)</Label>
                  <Input 
                    value={form.tenor} 
                    onChange={(e) => setForm({ ...form, tenor: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label>Maturity</Label>
                  <Input 
                    type="date"
                    value={form.maturity} 
                    onChange={(e) => setForm({ ...form, maturity: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label>GL Number</Label>
                  <Input 
                    value={form.glNum} 
                    onChange={(e) => setForm({ ...form, glNum: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label>Opened On</Label>
                  <Input 
                    type="date"
                    value={form.openedOn} 
                    onChange={(e) => setForm({ ...form, openedOn: e.target.value })}
                  />
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex gap-2">
                <Button 
                  variant="primary"
                  onClick={createAccount}
                  disabled={!form.accountName || !form.branchCode || !form.accountNo}
                >
                  Create
                </Button>
                <Button variant="secondary" onClick={resetForm}>Reset</Button>
              </div>
            </CardFooter>
          </Card>
        ) },
        
        { id: 'search', label: 'Search', content: (
          <Card>
            <CardHeader>Search Account</CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="space-y-1.5">
                  <Label>Account Number</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={searchAccountNo} 
                      onChange={(e) => setSearchAccountNo(e.target.value)} 
                      placeholder="Enter Account Number..." 
                    />
                    <Button 
                      variant="primary" 
                      onClick={searchByAccountNo}
                      disabled={!searchAccountNo}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
              
              {selectedAccount && (
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Account Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Account Number</span>
                      <p className="font-medium">{selectedAccount.accountNo}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Customer</span>
                      <p className="font-medium">{selectedAccount.customerName}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status</span>
                      <p className="font-medium">{selectedAccount.status}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Balance</span>
                      <p className="font-medium">
                        {selectedAccount.currency} {parseFloat(selectedAccount.balance).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Branch Code</span>
                      <p className="font-medium">{selectedAccount.branchCode}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Opened On</span>
                      <p className="font-medium">{selectedAccount.openedOn}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Product</span>
                      <p className="font-medium">
                        {productsData.products.find(p => p.id === selectedAccount.productId)?.name || '—'}
                      </p>
                    </div>
                    {selectedAccount.tenor && (
                      <div>
                        <span className="text-sm text-gray-500">Tenor</span>
                        <p className="font-medium">{selectedAccount.tenor} days</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => setIsEditModalOpen(true)}
                    >
                      Edit Account
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ) },
        
        { id: 'view', label: 'Account List', content: (
          <Card>
            <CardHeader>Accounts</CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <Table>
                  <THead>
                    <TRow>
                      <TH>Account No</TH>
                      <TH>Customer</TH>
                      <TH>Product</TH>
                      <TH>Status</TH>
                      <TH>Balance</TH>
                      <TH>Actions</TH>
                    </TRow>
                  </THead>
                  <tbody>
                    {allAccounts.length > 0 ? (
                      allAccounts.map((a) => (
                        <TRow key={a.id}>
                          <TD>{a.accountNo || '—'}</TD>
                          <TD>{a.customerName || a.custId}</TD>
                          <TD>{productsData.products.find(p => p.id === a.productId)?.name || '—'}</TD>
                          <TD>
                            <Badge color={a.status === 'Active' ? 'green' : 'gray'}>
                              {a.status}
                            </Badge>
                          </TD>
                          <TD>
                            {a.currency} {parseFloat(a.balance || 0).toFixed(2)}
                          </TD>
                          <TD>
                            <div className="flex gap-2">
                              <Button 
                                variant="secondary" 
                                size="xs"
                                onClick={() => {
                                  setViewAccount(a)
                                  setIsViewModalOpen(true)
                                }}
                              >
                                View
                              </Button>
                              <Button 
                                variant="outline" 
                                size="xs"
                                onClick={() => {
                                  setEditForm(a)
                                  setIsEditModalOpen(true)
                                }}
                              >
                                Edit
                              </Button>
                            </div>
                          </TD>
                        </TRow>
                      ))
                    ) : (
                      <TRow>
                        <TD colSpan={6} className="text-center py-4 text-gray-500">No accounts found</TD>
                      </TRow>
                    )}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        ) },
      ]} />
      
      {/* View Account Modal */}
      {viewAccount && (
        <Modal 
          isOpen={isViewModalOpen} 
          onClose={() => setIsViewModalOpen(false)}
          title="Account Details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Account ID</span>
              <p className="font-medium">{viewAccount.id}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Account Number</span>
              <p className="font-medium">{viewAccount.accountNo}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Account Name</span>
              <p className="font-medium">{viewAccount.accountName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Customer</span>
              <p className="font-medium">{viewAccount.customerName}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Customer ID</span>
              <p className="font-medium">{viewAccount.custId}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">External CIF</span>
              <p className="font-medium">{viewAccount.cifNo || '—'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Status</span>
              <p className="font-medium">{viewAccount.status}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Balance</span>
              <p className="font-medium">
                {viewAccount.currency} {parseFloat(viewAccount.balance || 0).toFixed(2)}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Branch Code</span>
              <p className="font-medium">{viewAccount.branchCode}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Opened On</span>
              <p className="font-medium">{viewAccount.openedOn}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Product</span>
              <p className="font-medium">
                {productsData.products.find(p => p.id === viewAccount.productId)?.name || '—'}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Sub Product</span>
              <p className="font-medium">
                {productsData.subProducts.find(p => p.id === viewAccount.subProductId)?.name || '—'}
              </p>
            </div>
            {viewAccount.tenor && (
              <div>
                <span className="text-sm text-gray-500">Tenor</span>
                <p className="font-medium">{viewAccount.tenor} days</p>
              </div>
            )}
            {viewAccount.maturity && (
              <div>
                <span className="text-sm text-gray-500">Maturity</span>
                <p className="font-medium">{viewAccount.maturity}</p>
              </div>
            )}
            {viewAccount.glNum && (
              <div>
                <span className="text-sm text-gray-500">GL Number</span>
                <p className="font-medium">{viewAccount.glNum}</p>
              </div>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
      
      {/* Edit Account Modal */}
      {editForm && (
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Account"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Account Number</Label>
              <Input 
                value={editForm.accountNo || ''} 
                disabled
              />
            </div>
            <div className="space-y-1.5">
              <Label>Customer</Label>
              <Input 
                value={editForm.customerName || ''} 
                disabled
              />
            </div>
            <div className="space-y-1.5">
              <Label>Account Name</Label>
              <Input 
                value={editForm.accountName || ''} 
                onChange={(e) => setEditForm({ ...editForm, accountName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Branch Code</Label>
              <Input 
                value={editForm.branchCode || ''} 
                onChange={(e) => setEditForm({ ...editForm, branchCode: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select 
                value={editForm.status || 'Active'} 
                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Deactivated</option>
                <option>Pending</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select 
                value={editForm.currency || 'USD'} 
                onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
                <option>JPY</option>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Balance</Label>
              <Input 
                type="number"
                value={editForm.balance || 0} 
                onChange={(e) => setEditForm({ ...editForm, balance: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tenor (days)</Label>
              <Input 
                value={editForm.tenor || ''} 
                onChange={(e) => setEditForm({ ...editForm, tenor: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Maturity</Label>
              <Input 
                type="date"
                value={editForm.maturity || ''} 
                onChange={(e) => setEditForm({ ...editForm, maturity: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="primary" onClick={updateAccount}>
              Update
            </Button>
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </Modal>
      )}
      
    </div>
  )
}

export default AccountPage


