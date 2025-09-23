import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type AlertKind = 'success' | 'error' | 'info'

export type AlertItem = {
  id: string
  kind: AlertKind
  message: string
}

type AlertContextValue = {
  alerts: AlertItem[]
  push: (kind: AlertKind, message: string) => void
  remove: (id: string) => void
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined)

export function useAlerts() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlerts must be used within AlertProvider')
  return ctx
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>([])

  const remove = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const push = useCallback((kind: AlertKind, message: string) => {
    const id = Math.random().toString(36).slice(2)
    setAlerts((prev) => [...prev, { id, kind, message }])
    setTimeout(() => remove(id), 3500)
  }, [remove])

  const value = useMemo(() => ({ alerts, push, remove }), [alerts, push, remove])

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  )
}


