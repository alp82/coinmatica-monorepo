import type { NextPage } from 'next'
import Head from 'next/head'
import { signIn, signOut, useSession } from 'next-auth/react'
import MainLayout from '../components/MainLayout'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Coinmatica</title>
        <meta name="description" content="Automate crypto signals" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainLayout>
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Coinmatica <span className="text-purple-300">T3</span> App
        </h1>
        <AuthShowcase />
      </MainLayout>
    </>
  )
}

export default Home

// Component to showcase protected routes using Auth
const AuthShowcase: React.FC = () => {
  const { data: session } = useSession()

  return (
    <div>
      {session && <p>Logged in as {session?.user?.name}</p>}
      <button
        className="px-4 py-2 border-2 border-blue-500 rounded-md"
        onClick={session ? () => signOut() : () => signIn()}
      >
        {session ? "Sign out" : "Sign in"}
      </button>
    </div>
  )
}
