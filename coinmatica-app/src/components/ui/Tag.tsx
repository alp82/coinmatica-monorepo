import React from 'react'
import { classNames } from '../../utils/styles'

const Tag = () => {
  const tag = {
    href: '',
    color: 'red',
    name: 'tag',
  }

  return (
    <a
      href={tag.href}
      className="relative inline-flex items-center rounded-full border border-gray-300 px-3 py-0.5 text-sm"
    >
      <span className="absolute flex-shrink-0 flex items-center justify-center">
        <span
          className={classNames(tag.color, 'h-1.5 w-1.5 rounded-full')}
          aria-hidden="true"
        />
      </span>
      <span className="ml-3.5 font-medium text-gray-900">{tag.name}</span>
    </a>
  )
}