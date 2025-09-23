import type { ReactNode } from 'react'

function Label({ children, required, htmlFor }: { children: ReactNode; required?: boolean; htmlFor?: string }) {
  return (
    <label className="text-sm font-medium text-gray-700 inline-flex items-center gap-1" htmlFor={htmlFor}>
      {children}
      {required ? <span className="text-red-600">*</span> : null}
    </label>
  )
}

export default Label


