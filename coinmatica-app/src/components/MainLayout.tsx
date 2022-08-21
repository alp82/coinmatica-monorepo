import React  from 'react'

import AppHeader from './AppHeader'

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <main className="container flex flex-col items-center justify-center min-h-screen p-4 mx-auto">
        <AppHeader />
        {children}
      </main>
    </>
  )
}

export default MainLayout
