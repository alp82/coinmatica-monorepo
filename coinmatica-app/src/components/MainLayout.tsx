import React  from 'react'

import AppHeader from './AppHeader'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-full">
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <AppHeader />
      <main className="max-w-5xl">
        {children}
      </main>
    </div>
  )
}

export default MainLayout
