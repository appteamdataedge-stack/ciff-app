import Tabs from '../../shared/ui/Tabs'
import { Card, CardBody, CardFooter, CardHeader } from '../../shared/ui/Card'
import Label from '../../shared/ui/Label'
import Input from '../../shared/ui/Input'
import Button from '../../shared/ui/Button'
import { useAlerts } from '../../shared/alerts/AlertContext'
import { storage } from '../../services/storage'

function OfficeAccountPage() {
  const { push } = useAlerts()
  const tabs = [
    { id: 'create', label: 'Create', content: (
      <Card>
        <CardHeader>Create Office Account</CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label required>GL Number</Label><Input required placeholder="e.g. 100101" /></div>
            <div className="space-y-1.5"><Label required>Name</Label><Input required placeholder="e.g. Vault Cash" /></div>
            <div className="space-y-1.5"><Label>Opening Balance</Label><Input placeholder="0.00" /></div>
          </div>
        </CardBody>
        <CardFooter>
          <Button onClick={() => {
            const id = 'OFF-' + Math.random().toString(36).slice(2,8).toUpperCase()
            storage.addItem('officeAccounts', { id })
            push('success', `Record created with ID: ${id}`)
          }}>Create</Button>
          <Button variant="secondary" className="ml-2">Reset</Button>
        </CardFooter>
      </Card>
    ) },
    { id: 'modify', label: 'Modify', content: (
      <Card>
        <CardHeader>Modify Office Account</CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label>Account No</Label><div className="flex gap-2"><Input placeholder="Lookup..." /><Button variant="secondary">Lookup</Button></div></div>
            <div className="space-y-1.5"><Label>Name</Label><Input /></div>
            <div className="space-y-1.5"><Label>Status</Label><Input placeholder="Active" /></div>
          </div>
        </CardBody>
        <CardFooter>
          <Button onClick={() => push('success', 'Record modified successfully')}>Save</Button>
        </CardFooter>
      </Card>
    ) },
    { id: 'verify', label: 'Verify', content: (<Card><CardBody>Verification disabled for Phase 1.</CardBody></Card>), disabled: true },
    { id: 'view', label: 'View', content: (<Card><CardBody>Coming soon</CardBody></Card>) },
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Office Account Management</h1>
      <Tabs tabs={tabs} />
    </div>
  )
}

export default OfficeAccountPage


