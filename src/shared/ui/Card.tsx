import type { ReactNode } from 'react'

export function Card({ children }: { children: ReactNode }) {
  return <div className="bg-white border rounded-xl shadow-sm">{children}</div>
}

export function CardHeader({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <div className={`px-4 py-3 border-b ${className}`}><div className="font-medium">{children}</div></div>
}

export function CardBody({ children, className = '' }: { children: ReactNode, className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>
}

export function CardFooter({ children }: { children: ReactNode }) {
  return <div className="px-4 py-3 border-t bg-gray-50 rounded-b-xl">{children}</div>
}


