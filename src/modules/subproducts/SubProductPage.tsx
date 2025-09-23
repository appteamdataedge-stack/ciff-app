import { useMemo, useState } from 'react'
import { Card, CardBody, CardFooter, CardHeader } from '../../shared/ui/Card'
import Tabs from '../../shared/ui/Tabs'
import Label from '../../shared/ui/Label'
import Input from '../../shared/ui/Input'
import Select from '../../shared/ui/Select'
import Button from '../../shared/ui/Button'
import { Table, THead, TH, TRow, TD } from '../../shared/ui/Table'
import productsData from '../../data/products.json'
import glData from '../../data/gl.json'
import Modal from '../../shared/ui/Modal'
import { useAlerts } from '../../shared/alerts/AlertContext'
import { storage } from '../../services/storage'

function SubProductPage() {
  const { push } = useAlerts()
  const [form, setForm] = useState({ id: '', code: '', name: '', productId: '', cumGlNum: '' })
  const [open, setOpen] = useState(false)

  const productOptions = useMemo(() => productsData.products, [])
  const glOptions = useMemo(() => glData.layer4, [])

  const createContent = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label required>Sub Product Code</Label>
          <Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label required>Name</Label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label required>Parent Product</Label>
          <Select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })}>
            <option value="">Select...</option>
            {productOptions.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label required>Cum_GL_Num (Layer 4)</Label>
          <Select value={form.cumGlNum} onChange={(e) => setForm({ ...form, cumGlNum: e.target.value })}>
            <option value="">Select...</option>
            {glOptions.map((g) => (<option key={g.id} value={g.id}>{g.id} - {g.name}</option>))}
          </Select>
        </div>
      </div>
      <div className="text-xs text-gray-500">ID will be auto-generated</div>
    </div>
  )

  const viewContent = (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <Table>
          <THead>
            <TRow>
              <TH>Code</TH><TH>Name</TH><TH>Product</TH><TH>GL</TH>
            </TRow>
          </THead>
          <tbody>
            {[...productsData.subProducts, ...storage.getList<any>('subProducts')].map((sp) => (
              <TRow key={sp.id}>
                <TD>{sp.code}</TD>
                <TD>{sp.name}</TD>
                <TD>{productOptions.find(p => p.id === sp.productId)?.name}</TD>
                <TD>{sp.cumGlNum}</TD>
              </TRow>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )

  const tabs = [
    { id: 'create', label: 'Create', content: (
      <>
        <Card>
          <CardHeader>Create Sub-Product</CardHeader>
          <CardBody>{createContent}</CardBody>
          <CardFooter>
            <Button onClick={() => { setOpen(true) }}>Create</Button>
            <Button variant="secondary" className="ml-2" onClick={() => setForm({ id: '', code: '', name: '', productId: '', cumGlNum: '' })}>Reset</Button>
          </CardFooter>
        </Card>
        <Modal open={open} title="Confirm Create" onClose={() => setOpen(false)} onConfirm={() => { 
          setOpen(false)
          const id = 'SUB-' + Math.random().toString(36).slice(2,8).toUpperCase()
          const record = { ...form, id }
          storage.addItem('subProducts', record)
          push('success', `Record created with ID: ${id}`)
        }}>Confirm</Modal>
      </>
    ) },
    { id: 'modify', label: 'Modify', content: (
      <Card>
        <CardHeader>Modify Sub-Product</CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label>Sub_Product_Id</Label>
              <div className="flex gap-2">
                <Input placeholder="Lookup..." />
                <Button variant="secondary">Lookup</Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Code</Label>
              <Input />
            </div>
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input />
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <Button onClick={() => push('success', 'Record modified successfully')}>Save</Button>
        </CardFooter>
      </Card>
    ) },
    { id: 'verify', label: 'Verify', content: (
      <Card><CardBody>
        <div className="text-sm text-gray-500">Maker-Checker placeholders in place. Verification disabled for Phase 1.</div>
      </CardBody></Card>
    ), disabled: true },
    { id: 'view', label: 'View', content: (
      <Card>
        <CardHeader>View Sub-Products</CardHeader>
        <CardBody>{viewContent}</CardBody>
      </Card>
    ) },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Sub-Product Management</h1>
      <Tabs tabs={tabs} />
    </div>
  )
}

export default SubProductPage


