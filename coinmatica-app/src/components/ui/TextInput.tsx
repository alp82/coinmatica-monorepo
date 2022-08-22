import React from 'react'
import { classNames } from '../../utils/styles'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
  description?: React.ReactNode
}

const TextInput = ({label, description, ...htmlProps}: InputProps) => {
  const { className, ...inputProps} = htmlProps

  return (
    <div>
      <label htmlFor={htmlProps.name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          type="text"
          {...inputProps}
          className={classNames(
            'shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md',
            className || '',
          )}
        />
      </div>
      {description && <p className="mt-2 text-sm text-gray-500" id="email-description">
        {description}
      </p>}
    </div>
  )
}

export default TextInput
