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
import { useAlerts } from '../../shared/alerts/AlertContext'
import { storage } from '../../services/storage'
import Modal from '../../shared/ui/Modal'

function CustomerPage() {
  const { push } = useAlerts()
  
  // Form state
  const [form, setForm] = useState({ 
    custType: '', 
    firstName: '', 
    lastName: '', 
    tradeName: '', 
    mobile: '', 
    externalCif: '', 
    address: '',
    email: '',
    fatherName: '',
    motherName: '',
    nidNumber: '',
    createdAt: new Date().toISOString()
  })
  
  // UI states
  const [isSearching, setIsSearching] = useState(false)
  const [customerFound, setCustomerFound] = useState<any>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [viewCustomer, setViewCustomer] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [searchCustId, setSearchCustId] = useState('')
  
  // Get all customers
  const storedCustomers = storage.getList<any>('customers')
  const allCustomers = [...customersData.customers, ...storedCustomers]
  
  // Reset form
  const resetForm = () => {
    setForm({ 
      custType: '', 
      firstName: '', 
      lastName: '', 
      tradeName: '', 
      mobile: '', 
      externalCif: '', 
      address: '',
      email: '',
      fatherName: '',
      motherName: '',
      nidNumber: '',
      createdAt: new Date().toISOString()
    })
    setCustomerFound(null)
  }
  
  // Search for a customer by External CIF
  const searchByCif = () => {
    setIsSearching(true)
    
    // Simulate API delay
    setTimeout(() => {
      const found = allCustomers.find(c => c.externalCif === form.externalCif)
      if (found) {
        setCustomerFound(found)
        push('info', `Customer found with External CIF: ${form.externalCif}`)
      } else {
        setCustomerFound(null)
        push('info', `No customer found with External CIF: ${form.externalCif}. You can create a new one.`)
      }
      setIsSearching(false)
    }, 500)
  }
  
  // Search for customer by ID for modify
  const searchById = () => {
    const found = allCustomers.find(c => c.id === searchCustId)
    if (found) {
      setSelectedCustomerId(found.id)
      setEditForm(found)
      push('info', `Customer found: ${found.id}`)
    } else {
      push('error', `No customer found with ID: ${searchCustId}`)
    }
  }
  
  // Save customer data
  const saveCustomer = () => {
    // Validation
    if (form.custType === '') {
      push('error', 'Customer Type is required')
      return
    }
    
    if (form.custType === 'Individual') {
      if (!form.firstName || !form.lastName) {
        push('error', 'First and Last Name are required')
        return
      }
    } else if (!form.tradeName) {
      push('error', 'Trade Name is required')
      return
    }
    
    // Create new customer
    const id = 'CIF-' + Math.random().toString(36).slice(2,8).toUpperCase()
    const record = { 
      id, 
      ...form,
      createdAt: new Date().toISOString()
    }
    storage.addItem('customers', record)
    push('success', `Customer created with ID: ${id}`)
    resetForm()
  }
  
  // Update customer
  const updateCustomer = () => {
    const customers = storage.getList<any>('customers')
    const updatedCustomers = customers.map(c => 
      c.id === editForm.id ? editForm : c
    )
    storage.setList('customers', updatedCustomers)
    push('success', 'Customer updated successfully')
    setIsEditModalOpen(false)
    setSelectedCustomerId('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Customer Management</h1>
        <Badge color="primary">Create & Manage</Badge>
      </div>

      <Tabs tabs={[
        { id: 'create', label: 'Create', content: (
          <Card>
            <CardHeader className="flex justify-between items-center bg-primary-light">
              <span>Create Customer</span>
              {customerFound && (
                <Badge color="primary">Customer Found</Badge>
              )}
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label>External CIF</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={form.externalCif} 
                      onChange={(e) => setForm({ ...form, externalCif: e.target.value })} 
                      placeholder="Enter External CIF No." 
                      disabled={customerFound !== null}
                    />
                    <Button 
                      variant="primary" 
                      size="sm" 
                      className="whitespace-nowrap" 
                      onClick={searchByCif}
                      disabled={isSearching || !form.externalCif || customerFound !== null}
                    >
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>
                </div>
                
                {customerFound ? (
                  <div className="md:col-span-3">
                    <div className="bg-primary-light p-4 rounded-md mb-4">
                      <h3 className="font-medium text-primary mb-2">Customer Already Exists</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-gray-500">Customer ID</span>
                          <p className="font-medium">{customerFound.id}</p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Name</span>
                          <p className="font-medium">
                            {customerFound.firstName 
                              ? `${customerFound.firstName} ${customerFound.lastName}`
                              : customerFound.tradeName}
                          </p>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Type</span>
                          <p className="font-medium">{customerFound.custType}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="secondary" size="sm" onClick={() => setViewCustomer(customerFound)}>
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetForm}>
                          Create New Instead
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                <div className="space-y-1.5">
                      <Label required>Customer Type</Label>
                      <Select 
                        value={form.custType} 
                        onChange={(e) => setForm({ ...form, custType: e.target.value })}
                      >
                    <option value="">Select...</option>
                    <option>Individual</option>
                    <option>Corporate</option>
                    <option>Bank</option>
                  </Select>
                </div>
                    
                {form.custType === 'Individual' && (
                  <>
                    <div className="space-y-1.5">
                      <Label required>First name</Label>
                          <Input 
                            required 
                            value={form.firstName} 
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          />
                      {!form.firstName && <div className="text-xs text-red-600">First name is required</div>}
                    </div>
                    <div className="space-y-1.5">
                      <Label required>Last name</Label>
                          <Input 
                            required 
                            value={form.lastName} 
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          />
                      {!form.lastName && <div className="text-xs text-red-600">Last name is required</div>}
                    </div>
                        <div className="space-y-1.5">
                          <Label>Father's Name</Label>
                          <Input
                            value={form.fatherName}
                            onChange={(e) => setForm({ ...form, fatherName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Mother's Name</Label>
                          <Input
                            value={form.motherName}
                            onChange={(e) => setForm({ ...form, motherName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>NID Number</Label>
                          <Input
                            value={form.nidNumber}
                            onChange={(e) => setForm({ ...form, nidNumber: e.target.value })}
                          />
                        </div>
                  </>
                )}
                    
                {(form.custType === 'Corporate' || form.custType === 'Bank') && (
                      <div className="space-y-1.5 md:col-span-2">
                        <Label required>Trade Name</Label>
                        <Input 
                          required 
                          value={form.tradeName} 
                          onChange={(e) => setForm({ ...form, tradeName: e.target.value })}
                        />
                        {!form.tradeName && <div className="text-xs text-red-600">Trade Name is required</div>}
                  </div>
                )}
                    
                <div className="space-y-1.5">
                  <Label>Mobile</Label>
                      <Input 
                        value={form.mobile} 
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })} 
                        placeholder="<= 15 digits"
                      />
                      {form.mobile && !/^\d{1,15}$/.test(form.mobile) && 
                        <div className="text-xs text-red-600">Must be numeric up to 15 digits</div>
                      }
                    </div>
                    
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input 
                        type="email"
                        value={form.email} 
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                </div>
                    
                <div className="space-y-1.5 md:col-span-3">
                  <Label>Address</Label>
                      <Input 
                        value={form.address} 
                        onChange={(e) => setForm({ ...form, address: e.target.value })} 
                        placeholder="Street, City, State, ZIP"
                      />
                </div>
                  </>
                )}
              </div>
            </CardBody>
            <CardFooter>
              <div className="flex gap-2">
                <Button 
                  onClick={saveCustomer}
                  disabled={customerFound !== null}
                >
                  Save
                </Button>
                <Button variant="secondary" onClick={resetForm}>Reset</Button>
              </div>
            </CardFooter>
          </Card>
        ) },
        { id: 'search', label: 'Search', content: (
          <Card>
            <CardHeader>Search Customer</CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Customer ID</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={searchCustId} 
                      onChange={(e) => setSearchCustId(e.target.value)} 
                      placeholder="Enter Customer ID..." 
                    />
                    <Button 
                      variant="primary" 
                      onClick={searchById}
                      disabled={!searchCustId}
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </div>
              
              {selectedCustomerId && editForm && (
                <div className="mt-6 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-4">Customer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Customer ID</span>
                      <p className="font-medium">{editForm.id}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Type</span>
                      <p className="font-medium">{editForm.custType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Name</span>
                      <p className="font-medium">
                        {editForm.firstName 
                          ? `${editForm.firstName} ${editForm.lastName}`
                          : editForm.tradeName}
                      </p>
                    </div>
                    {editForm.mobile && (
                      <div>
                        <span className="text-sm text-gray-500">Mobile</span>
                        <p className="font-medium">{editForm.mobile}</p>
                      </div>
                    )}
                    {editForm.email && (
                  <div>
                        <span className="text-sm text-gray-500">Email</span>
                        <p className="font-medium">{editForm.email}</p>
                      </div>
                    )}
                    {editForm.address && (
                      <div className="md:col-span-3">
                        <span className="text-sm text-gray-500">Address</span>
                        <p className="font-medium">{editForm.address}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="primary" size="sm" onClick={() => setIsEditModalOpen(true)}>
                      Edit Customer
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ) },
        { id: 'view', label: 'Customer List', content: (
          <Card>
            <CardHeader>Customer List</CardHeader>
            <CardBody>
              <div className="overflow-x-auto">
                <Table>
                  <THead>
                    <TRow>
                      <TH>Cust_Id</TH>
                      <TH>Type</TH>
                      <TH>Name</TH>
                      <TH>Mobile</TH>
                      <TH>Email</TH>
                      <TH>Actions</TH>
                    </TRow>
                  </THead>
                  <tbody>
                    {allCustomers.map((c) => (
                      <TRow key={c.id}>
                        <TD>{c.id}</TD>
                        <TD>{c.custType}</TD>
                        <TD>{c.firstName ? `${c.firstName} ${c.lastName}` : c.tradeName}</TD>
                        <TD>{c.mobile}</TD>
                        <TD>{c.email || '—'}</TD>
                        <TD>
                          <div className="flex gap-2">
                            <Button 
                              variant="secondary" 
                              size="xs"
                              onClick={() => {
                                setViewCustomer(c)
                                setIsViewModalOpen(true)
                              }}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline" 
                              size="xs"
                              onClick={() => {
                                setEditForm(c)
                                setIsEditModalOpen(true)
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        </TD>
                      </TRow>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        ) },
      ]} />
      
      {/* View Customer Modal */}
      {viewCustomer && (
        <Modal 
          isOpen={isViewModalOpen} 
          onClose={() => setIsViewModalOpen(false)}
          title="Customer Details"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Customer ID</span>
              <p className="font-medium">{viewCustomer.id}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">External CIF</span>
              <p className="font-medium">{viewCustomer.externalCif || '—'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Type</span>
              <p className="font-medium">{viewCustomer.custType}</p>
            </div>
            {viewCustomer.custType === 'Individual' ? (
              <>
                <div>
                  <span className="text-sm text-gray-500">First Name</span>
                  <p className="font-medium">{viewCustomer.firstName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Last Name</span>
                  <p className="font-medium">{viewCustomer.lastName}</p>
                </div>
                {viewCustomer.fatherName && (
                  <div>
                    <span className="text-sm text-gray-500">Father's Name</span>
                    <p className="font-medium">{viewCustomer.fatherName}</p>
                  </div>
                )}
                {viewCustomer.motherName && (
                  <div>
                    <span className="text-sm text-gray-500">Mother's Name</span>
                    <p className="font-medium">{viewCustomer.motherName}</p>
                  </div>
                )}
                {viewCustomer.nidNumber && (
                  <div>
                    <span className="text-sm text-gray-500">NID Number</span>
                    <p className="font-medium">{viewCustomer.nidNumber}</p>
                  </div>
                )}
              </>
            ) : (
              <div>
                <span className="text-sm text-gray-500">Trade Name</span>
                <p className="font-medium">{viewCustomer.tradeName}</p>
              </div>
            )}
            {viewCustomer.mobile && (
              <div>
                <span className="text-sm text-gray-500">Mobile</span>
                <p className="font-medium">{viewCustomer.mobile}</p>
              </div>
            )}
            {viewCustomer.email && (
              <div>
                <span className="text-sm text-gray-500">Email</span>
                <p className="font-medium">{viewCustomer.email}</p>
              </div>
            )}
            {viewCustomer.address && (
              <div className="md:col-span-2">
                <span className="text-sm text-gray-500">Address</span>
                <p className="font-medium">{viewCustomer.address}</p>
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
      
      {/* Edit Customer Modal */}
      {editForm && (
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Customer"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Customer Type</Label>
              <Select 
                value={editForm.custType} 
                onChange={(e) => setEditForm({ ...editForm, custType: e.target.value })}
                disabled
              >
                <option>Individual</option>
                <option>Corporate</option>
                <option>Bank</option>
              </Select>
            </div>
            
            <div className="space-y-1.5">
              <Label>External CIF</Label>
              <Input 
                value={editForm.externalCif || ''} 
                onChange={(e) => setEditForm({ ...editForm, externalCif: e.target.value })}
              />
            </div>
            
            {editForm.custType === 'Individual' ? (
              <>
                <div className="space-y-1.5">
                  <Label required>First name</Label>
                  <Input 
                    required 
                    value={editForm.firstName || ''} 
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label required>Last name</Label>
                  <Input 
                    required 
                    value={editForm.lastName || ''} 
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Father's Name</Label>
                  <Input
                    value={editForm.fatherName || ''}
                    onChange={(e) => setEditForm({ ...editForm, fatherName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Mother's Name</Label>
                  <Input
                    value={editForm.motherName || ''}
                    onChange={(e) => setEditForm({ ...editForm, motherName: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>NID Number</Label>
                  <Input
                    value={editForm.nidNumber || ''}
                    onChange={(e) => setEditForm({ ...editForm, nidNumber: e.target.value })}
                  />
                </div>
              </>
            ) : (
              <div className="space-y-1.5 md:col-span-2">
                <Label required>Trade Name</Label>
                <Input 
                  required 
                  value={editForm.tradeName || ''} 
                  onChange={(e) => setEditForm({ ...editForm, tradeName: e.target.value })}
                />
              </div>
            )}
            
            <div className="space-y-1.5">
              <Label>Mobile</Label>
              <Input 
                value={editForm.mobile || ''} 
                onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })} 
                placeholder="<= 15 digits"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input 
                type="email"
                value={editForm.email || ''} 
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-1.5 md:col-span-2">
              <Label>Address</Label>
              <Input 
                value={editForm.address || ''} 
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} 
                placeholder="Street, City, State, ZIP"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="primary" onClick={updateCustomer}>
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

export default CustomerPage


