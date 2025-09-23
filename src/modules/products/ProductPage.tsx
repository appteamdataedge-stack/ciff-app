import { useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from '../../shared/ui/Card'
import Button from '../../shared/ui/Button'
import Input from '../../shared/ui/Input'
import Label from '../../shared/ui/Label'
import Select from '../../shared/ui/Select'
import { Table, THead, TH, TRow, TD } from '../../shared/ui/Table'
import Badge from '../../shared/ui/Badge'
import Tabs from '../../shared/ui/Tabs'
import productsData from '../../data/products.json'
import glData from '../../data/gl.json'
import { useAlerts } from '../../shared/alerts/AlertContext'
import { storage } from '../../services/storage'

function ProductPage() {
  const { push } = useAlerts()
  const [form, setForm] = useState({ code: '', name: '', status: 'Active', rate: '', cumGlNum: '' })
  const createTab = (
    <Card>
      <CardHeader>Setup Product</CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label required>Product Name</Label>
            <Input required placeholder="e.g. MM Deposit" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label required>Code</Label>
            <Input required placeholder="e.g. MMD" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Inactive</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Interest Rate %</Label>
            <Input placeholder="e.g. 7.5" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label required>Cum_GL_Num (Layer 3)</Label>
            <Select value={form.cumGlNum} onChange={(e) => setForm({ ...form, cumGlNum: e.target.value })}>
              <option value="">Select...</option>
              {glData.layer3.map((g) => (<option key={g.id} value={g.id}>{g.id} - {g.name}</option>))}
            </Select>
          </div>
        </div>
      </CardBody>
      <CardFooter>
        <div className="flex gap-2">
          <Button onClick={() => {
            if (!form.code || !form.name || !form.cumGlNum) return
            const id = 'PRD-' + Math.random().toString(36).slice(2,8).toUpperCase()
            const record = { id, ...form }
            storage.addItem('products', record)
            push('success', `Record created with ID: ${id}`)
          }}>Save</Button>
          <Button variant="secondary">Reset</Button>
        </div>
      </CardFooter>
    </Card>
  )

  const viewTab = (
    <Card>
      <CardHeader>Products</CardHeader>
      <CardBody>
        <div className="overflow-x-auto">
          <Table>
            <THead>
              <TRow>
                <TH>Name</TH>
                <TH>Code</TH>
                <TH>Status</TH>
                <TH>Rate</TH>
              </TRow>
            </THead>
            <tbody>
              {[...productsData.products, ...storage.getList<any>('products')].map((p) => (
                <TRow key={p.id}>
                  <TD>{p.name}</TD>
                  <TD>{p.code}</TD>
                  <TD><Badge color="green">{p.status}</Badge></TD>
                  <TD>7.5%</TD>
                </TRow>
              ))}
            </tbody>
          </Table>
        </div>
      </CardBody>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product & Sub-Product Management</h1>
        <Badge color="blue">Setup & Lifecycle</Badge>
      </div>

      <Tabs tabs={[
        { id: 'create', label: 'Create', content: createTab },
        { id: 'modify', label: 'Modify', content: (<Card><CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5"><Label>Product_Id</Label><div className="flex gap-2"><Input placeholder="Lookup..." /><Button variant="secondary">Lookup</Button></div></div>
            <div className="space-y-1.5"><Label>Code</Label><Input /></div>
            <div className="space-y-1.5"><Label>Name</Label><Input /></div>
          </div>
          <div className="mt-4"><Button onClick={() => push('success', 'Record modified successfully')}>Save</Button></div>
        </CardBody></Card>) },
        { id: 'verify', label: 'Verify', content: (<Card><CardBody>Verification disabled for Phase 1.</CardBody></Card>), disabled: true },
        { id: 'view', label: 'View', content: viewTab },
      ]} />
    </div>
  )
}

export default ProductPage


