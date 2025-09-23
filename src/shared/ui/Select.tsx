import type { SelectHTMLAttributes } from 'react'
import { forwardRef } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement>

const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className = '', ...props },
  ref,
) {
  return (
    <select
      ref={ref}
      className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-300 focus:outline-none ${className}`}
      {...props}
    />
  )
})

export default Select


