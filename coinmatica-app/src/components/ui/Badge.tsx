import React from 'react'
import { classNames } from '../../utils/styles'
import { Color, BGColor, TextColor } from '../../utils/colors'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  color: Color
  classNameActive?: string
  classNameInactive?: string
}

const Badge =({children, color = 'grey', ...htmlProps}: BadgeProps) => {
  const { className, ...spanProps} = htmlProps

  const textColor = TextColor[color]
  const bgColor = BGColor[color]

  return (
    <span
      {...spanProps}
      className={classNames(
        `inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${bgColor} ${textColor}`,
        className || '',
      )}
  >
      <svg className="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
        <circle cx={4} cy={4} r={3} />
      </svg>
      {children}
    </span>
  )
}

export default Badge