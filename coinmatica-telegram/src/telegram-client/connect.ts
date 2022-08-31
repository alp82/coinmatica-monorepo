import Client, { ConfigType } from 'tdl'
import { TDLib } from 'tdl-tdlib-addon'
import { TelegramConnectionStatus } from '../../../shared/types/models/TelegramClientInfo'
import { UserSettings } from '../../../shared/types/models/UserSettings'
import { getLogger } from '../../../shared/log/winston_client'
import { LogCode } from '../../../shared/log/logCode'
import { login, resetAuthTokenIfNeeded } from './auth'
import { updateConnectionStatus } from './utils'

const logger = getLogger()

const clients: Record<string, Client> = {}

export const connectTelegramClient = async (
  userId: string | undefined,
  userSettings: UserSettings | null,
): Promise<Client> => {
  if (!userId) {
    logger.error('telegram client can not be connected due to empty userId', {
      logCode: LogCode.TELEGRAM_CLIENT,
    })
    throw new Error('connectTelegramClient: userId missing')
  }

  if (!userSettings) {
    logger.error('telegram client can not be connected due to empty userSettings', {
      logCode: LogCode.TELEGRAM_CLIENT,
    })
    throw new Error('connectTelegramClient: userSettings missing')
  }

  logger.debug(`attempting to connect telegram client for user ${userId}`, {
    logCode: LogCode.TELEGRAM_CLIENT,
    userId,
  })

  // disconnect existing client
  if (clients[userId]) {
    // @ts-ignore
    await clients[userId].close()
  }

  // configure new client
  let client: Client
  const tdlibPath = process.env.TDLIB_PATH
  const apiId = parseInt(userSettings?.telegramAppApiId || '')
  const apiHash = userSettings?.telegramAppApiHash
  try {
    client = new Client(new TDLib(tdlibPath), {
      apiId,
      apiHash,
      skipOldUpdates: false,
    })
    logger.debug(`telegram client created for user ${userId}`, {
      logCode: LogCode.TELEGRAM_CLIENT,
      userId,
    })
  } catch (error: any) {
    logger.error(`telegram client could not be created for user ${userId}`, {
      logCode: LogCode.TELEGRAM_CLIENT,
      userId,
      tdlibPath,
      apiId,
      apiHash,
      error,
    })

    updateConnectionStatus({
      userId,
      connectionEstablished: false,
      connectionStatus: TelegramConnectionStatus.CONNECTION_FAILED,
    })

    throw new Error(error instanceof String ? error as string : JSON.stringify(error as object))
  }

  // set up client listeners
  client.on('error', (error: any) => {
    logger.error(`telegram client connection dropped for user ${userId}`, {
        logCode: LogCode.TELEGRAM_CLIENT,
        userId,
        error,
      })

    updateConnectionStatus({
      userId,
      connectionEstablished: false,
      connectionStatus: TelegramConnectionStatus.CONNECTION_FAILED,
    })
  })

  // connect and login
  // await client.connectAndLogin()
  clients[userId] = client
  await client.connect()
    .then(async () => {
      logger.debug(`telegram client connection established for user ${userId}`, {
        logCode: LogCode.TELEGRAM_CLIENT,
        userId,
      })
    })
    .catch((error) => {
      logger.error(`telegram client connection failed for user ${userId}`, {
          logCode: LogCode.TELEGRAM_CLIENT,
          userId,
          error,
        })

      updateConnectionStatus({
        userId,
        connectionEstablished: false,
        connectionStatus: TelegramConnectionStatus.CONNECTION_FAILED,
      })
    })

  await login(client, userId, userSettings)
    .then(() => {
      logger.debug(`telegram client login successful for user ${userId}`, {
        logCode: LogCode.TELEGRAM_CLIENT,
        userId,
      })

      updateConnectionStatus({
        userId,
        connectionEstablished: true,
        connectionStatus: TelegramConnectionStatus.SUCCESS,
      })
      resetAuthTokenIfNeeded(userId)
    })
    .catch((error) => {
      logger.error(`telegram client login failed for user ${userId}`, {
        logCode: LogCode.TELEGRAM_CLIENT,
        userId,
        error,
      })

      const { connectionStatus } = error.err
      updateConnectionStatus({
        userId,
        connectionEstablished: false,
        connectionStatus,
      })
    })

  return client
}