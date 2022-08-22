import React from 'react'
import { classNames } from '../../utils/styles'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function Button({children, ...htmlProps}: ButtonProps) {
  const { className, ...buttonProps} = htmlProps

  return (
    <button
      {...buttonProps}
      className={classNames(
        'inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
        className || '',
      )}
    >
      {children}
    </button>
  )
}
