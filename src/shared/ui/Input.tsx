import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { className = '', required, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={`w-full border rounded-md px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-gray-300 focus:outline-none ${required ? 'required' : ''} ${className}`}
      {...props}
    />
  )
})

export default Input


