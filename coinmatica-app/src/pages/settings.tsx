import { KeyIcon, UserCircleIcon, ViewGridAddIcon } from '@heroicons/react/outline'
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

import { trpc } from '../utils/trpc'
import { classNames } from '../utils/styles'
import Badge from '../components/ui/Badge'
import TextInput from '../components/ui/TextInput'
import { TelegramConnectionStatus } from '../types/models/TelegramClientInfo'
import { UserSettings } from '../types/models/UserSettings'
import MainLayout from '../components/MainLayout'
import A from '../components/ui/A'

const navigation = [
  {name: 'Account', href: '#', icon: UserCircleIcon, current: true},
  {name: 'Password', href: '#', icon: KeyIcon, current: false},
  {name: 'Integrations', href: '#', icon: ViewGridAddIcon, current: false},
]

const Settings = () => {
  const {data: session} = useSession()
  const userId = session?.user?.id || ''

  const userSettings = trpc.proxy.userSettings.fetch.useQuery(
    {userId},
    {enabled: Boolean(userId)},
  )
  const updateMobile = trpc.proxy.userSettings.updateMobile.useMutation()
  const updateTelegram = trpc.proxy.userSettings.updateTelegram.useMutation()

  const telegramClientInfo = trpc.proxy.telegram.fetchClientInfo.useQuery(
    {userId},
    {enabled: Boolean(userId)},
  )

  const handleMobilePhoneSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session?.user?.id) return
    const mobilePhoneNumber = (e.currentTarget.querySelector(`[name="mobilePhoneNumber"]`) as HTMLInputElement).value

    if (mobilePhoneNumber) {
      updateMobile.mutate({
        userId,
        mobilePhoneNumber,
      })
    }
  }

  const handleTelegramAPISubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!session?.user?.id) return

    const formData = new FormData(e.currentTarget)
    const entries = formData.entries()

    let updateTelegramRequest: Partial<UserSettings> | undefined
    for (const entry of entries) {
      const [name, value] = entry
      updateTelegramRequest = {
        ...(updateTelegramRequest || {}),
        [name]: value.toString(),
      }
    }

    if (updateTelegramRequest) {
      updateTelegram.mutate({
        userId,
        ...updateTelegramRequest,
      })
    }
  }

  if (!session) {
    return <>
      <h2>Not authorized</h2>
      <A href="/">
        back
      </A>
    </>
  }

  return (
    <>
      <Head>
        <title>Settings | Coinmatica</title>
        <meta name="description" content="Automate crypto signals"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <MainLayout>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-50 text-indigo-700 hover:text-indigo-700 hover:bg-white'
                      : 'text-gray-900 hover:text-gray-900 hover:bg-gray-50',
                    'group rounded-md px-3 py-2 flex items-center text-sm font-medium',
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? 'text-indigo-500 group-hover:text-indigo-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'flex-shrink-0 -ml-1 mr-3 h-6 w-6',
                    )}
                    aria-hidden="true"
                  />
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div className="grid grid-cols-2 gap-2">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Integrations</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="mt-1 text-sm">Telegram</p>
                    </div>
                    <div>
                      {telegramClientInfo.isLoading && <>Loading...</>}
                      {telegramClientInfo.isError && <>Error: {telegramClientInfo.error.message}</>}
                      {telegramClientInfo.data && (
                        <>
                          {
                            telegramClientInfo.data.connectionEstablished ? <Badge color="green">Connected</Badge> : (
                              <>
                                {!telegramClientInfo.data.connectionStatus && <Badge color="blue-grey">Unknown</Badge>}
                                {telegramClientInfo.data.connectionStatus === TelegramConnectionStatus.NOT_CONFIGURED &&
                                  <Badge color="deep-orange">Not Configured</Badge>}
                                {telegramClientInfo.data.connectionStatus === TelegramConnectionStatus.CONNECTION_FAILED &&
                                  <Badge color="red">Connection Failed</Badge>}
                                {telegramClientInfo.data.connectionStatus === TelegramConnectionStatus.MISSING_OR_WRONG_MOBILE_NUMBER &&
                                  <Badge color="red">Wrong Phone Number</Badge>}
                                {telegramClientInfo.data.connectionStatus === TelegramConnectionStatus.MISSING_OR_WRONG_API_SETTINGS &&
                                  <Badge color="red">Wrong App API details</Badge>}
                                {telegramClientInfo.data.connectionStatus === TelegramConnectionStatus.MISSING_OR_WRONG_AUTH_CODE &&
                                  <Badge color="red">Wrong Auth Code</Badge>}
                                {telegramClientInfo.data.connectionStatus === TelegramConnectionStatus.MISSING_OR_WRONG_PASSWORD &&
                                  <Badge color="red">Wrong Password</Badge>}
                              </>
                            )
                          }
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleMobilePhoneSubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Settings</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Set up your account.
                    </p>
                  </div>
                  {userSettings.isLoading && <>Loading...</>}
                  {userSettings.isError && <>Error: {userSettings.error.message}</>}
                  {updateMobile.isError && <>Error: {updateMobile.error.message}</>}
                  {userSettings.isSuccess && (
                    <>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <TextInput
                            label="Mobile Phone Number"
                            name="mobilePhoneNumber"
                            placeholder="Mobile number"
                            defaultValue={userSettings.data?.mobilePhoneNumber}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={!userSettings.isSuccess || updateMobile.isLoading}
                    className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>

            <form onSubmit={handleTelegramAPISubmit}>
              <div className="shadow sm:rounded-md sm:overflow-hidden">
                <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Telegram API</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Set up your Telegram API.
                    </p>
                  </div>
                  {userSettings.isLoading && <>Loading...</>}
                  {userSettings.isError && <>Error: {userSettings.error.message}</>}
                  {updateTelegram.isError && <>Error: {updateTelegram.error.message}</>}
                  {userSettings.isSuccess && (
                    <>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <TextInput
                            label="Telegram App API ID"
                            name="telegramAppApiId"
                            placeholder="API ID"
                            defaultValue={userSettings.data?.telegramAppApiId}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <TextInput
                            label="Telegram App API Hash"
                            name="telegramAppApiHash"
                            placeholder="API Hash"
                            defaultValue={userSettings.data?.telegramAppApiHash}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 sm:col-span-2">
                          <TextInput
                            label="Telegram Auth Code"
                            description="Enter auth code from 'Telegram' that is sent to your telegram app"
                            name="telegramAuthCode"
                            placeholder="Auth Code"
                            defaultValue={userSettings.data?.telegramAuthCode}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    disabled={!userSettings.isSuccess || updateTelegram.isLoading}
                    className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </MainLayout>
    </>
  )
}

export default Settings
