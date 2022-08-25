import React from 'react'
import Link from 'next/link'
import { classNames } from '../../utils/styles'
import { useRouter } from 'next/router'


export interface AProps {
  href: string
  as?: React.ComponentType
  children: React.ReactNode
}

const A = ({ href, as, children }: AProps) => {
  const router = useRouter()
  const Inner = as ? as : 'a'

  return (
    <Link
      href={href}
      passHref={true}
      aria-current={router.asPath === href ? 'page' : undefined}
    >
      <Inner
        className={classNames(
          router.asPath === href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          'px-3 py-2 rounded-md text-sm font-medium'
        )}
      >
        {children}
      </Inner>
    </Link>
  )
}

export default A