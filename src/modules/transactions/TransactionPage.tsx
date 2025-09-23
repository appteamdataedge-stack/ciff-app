import { useMemo, useState } from 'react'
import { Card, CardBody, CardHeader } from '../../shared/ui/Card'
import Button from '../../shared/ui/Button'
import Input from '../../shared/ui/Input'
import Select from '../../shared/ui/Select'
import { Table, THead, TH, TRow, TD } from '../../shared/ui/Table'
import Badge from '../../shared/ui/Badge'
import customers from '../../data/customers.json'
import { useAlerts } from '../../shared/alerts/AlertContext'

function TransactionPage() {
  const { push } = useAlerts()
  const custOptions = useMemo(() => customers.customers, [])
  const [rows, setRows] = useState<{ id: string; account: string; leg: 'Debit' | 'Credit'; amount: string; narration: string }[]>([
    { id: 'r1', account: '', leg: 'Debit', amount: '', narration: '' },
  ])

  const totals = rows.reduce((acc, r) => {
    const amt = parseFloat(r.amount || '0') || 0
    if (r.leg === 'Debit') acc.debit += amt
    else acc.credit += amt
    return acc
  }, { debit: 0, credit: 0 })

  const addRow = () => setRows((rs) => [...rs, { id: Math.random().toString(36).slice(2), account: '', leg: 'Debit', amount: '', narration: '' }])
  const updateRow = (id: string, field: string, value: string) => setRows((rs) => rs.map(r => r.id === id ? { ...r, [field]: value } : r))
  const removeRow = (id: string) => setRows((rs) => rs.filter(r => r.id !== id))

  const canSave = totals.debit === totals.credit && totals.debit > 0

  const onSave = () => {
    if (!canSave) {
      push('error', 'Debit amount does not equal credit amount.')
      return
    }
    const id = 'TRN-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    push('success', `Transaction saved with ID: ${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transactions & Balance Management</h1>
        <Badge color="blue">User & System</Badge>
      </div>

      <Card>
        <CardHeader>Transaction Entry (Multi-leg)</CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TRow>
                  <TH>Account</TH>
                  <TH>Leg</TH>
                  <TH>Amount</TH>
                  <TH>Narration</TH>
                  <TH>Action</TH>
                </TRow>
              </THead>
              <tbody>
                {rows.map((r) => (
                  <TRow key={r.id}>
                    <TD>
                      <Select value={r.account} onChange={(e) => updateRow(r.id, 'account', e.target.value)}>
                        <option value="">Select Account (Customer)</option>
                        {custOptions.map((c) => (
                          <option key={c.id} value={c.id}>{c.id} - {c.firstName || c.tradeName}</option>
                        ))}
                      </Select>
                    </TD>
                    <TD>
                      <Select value={r.leg} onChange={(e) => updateRow(r.id, 'leg', e.target.value)}>
                        <option>Debit</option>
                        <option>Credit</option>
                      </Select>
                    </TD>
                    <TD>
                      <Input value={r.amount} onChange={(e) => updateRow(r.id, 'amount', e.target.value)} placeholder="0.00" />
                    </TD>
                    <TD>
                      <Input value={r.narration} onChange={(e) => updateRow(r.id, 'narration', e.target.value)} placeholder="Optional" />
                    </TD>
                    <TD>
                      <Button variant="ghost" size="sm" onClick={() => removeRow(r.id)}>Remove</Button>
                    </TD>
                  </TRow>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <Button variant="secondary" onClick={addRow}>Add Row</Button>
            <div className="text-sm text-gray-700">Totals: <span className="font-medium">Debit {totals.debit.toFixed(2)}</span> / <span className="font-medium">Credit {totals.credit.toFixed(2)}</span></div>
          </div>
          <div className="mt-4">
            <Button onClick={onSave} disabled={!canSave}>Save Transaction</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Recent Transactions</CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TRow>
                  <TH>Date</TH>
                  <TH>Account</TH>
                  <TH>Type</TH>
                  <TH>Amount</TH>
                  <TH>Reference</TH>
                </TRow>
              </THead>
              <tbody>
                <TRow>
                  <TD>2025-09-18</TD>
                  <TD>001-000123</TD>
                  <TD>Deposit</TD>
                  <TD>1,000.00</TD>
                  <TD>MM/DEP/1001</TD>
                </TRow>
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default TransactionPage


