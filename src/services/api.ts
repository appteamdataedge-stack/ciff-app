// Mock API abstraction layer

export type Customer = { id: string; name: string; email: string; kycStatus: string }
export type Product = { id: string; name: string; code: string; status: 'Active' | 'Inactive'; rate: number }
export type Account = { id: string; accountNo: string; customerId: string; productId: string; balance: number }
export type Transaction = { id: string; accountNo: string; type: string; amount: number; reference: string; date: string }

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const api = {
  async listCustomers(): Promise<Customer[]> {
    await wait(300)
    return [
      { id: 'c1', name: 'John Doe', email: 'john@bank.test', kycStatus: 'Verified' },
    ]
  },
  async createCustomer(data: Omit<Customer, 'id'>): Promise<Customer> {
    await wait(300)
    return { id: Math.random().toString(36).slice(2), ...data }
  },
  async listProducts(): Promise<Product[]> {
    await wait(300)
    return [
      { id: 'p1', name: 'MM Deposit', code: 'MMD', status: 'Active', rate: 7.5 },
    ]
  },
  async listAccounts(): Promise<Account[]> {
    await wait(300)
    return [
      { id: 'a1', accountNo: '001-000123', customerId: 'c1', productId: 'p1', balance: 12500 },
    ]
  },
  async postTransaction(data: Omit<Transaction, 'id' | 'date'>): Promise<Transaction> {
    await wait(300)
    return { id: Math.random().toString(36).slice(2), date: new Date().toISOString().slice(0, 10), ...data }
  },
}


