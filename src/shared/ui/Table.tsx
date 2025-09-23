import type { ReactNode } from 'react'

export function Table({ children }: { children: ReactNode }) {
  return <table className="min-w-full text-sm">{children}</table>
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="bg-gray-50">{children}</thead>
}

export function TRow({ children }: { children: ReactNode }) {
  return <tr className="border-b last:border-0">{children}</tr>
}

export function TH({ children }: { children: ReactNode }) {
  return <th className="text-left p-2 font-medium text-gray-700">{children}</th>
}

export function TD({ children, colSpan, className = '' }: { children: ReactNode, colSpan?: number, className?: string }) {
  return <td className={`p-2 ${className}`} colSpan={colSpan}>{children}</td>
}


