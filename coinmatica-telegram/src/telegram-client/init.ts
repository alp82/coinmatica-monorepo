import { connectTelegramClient } from './connect'
import { onUpdateMessage } from './onUpdate'
import { getLogger } from '../../../shared/log/winston_client'
import { LogCode } from '../../../shared/log/logCode'
import { getCollectionTelegramClientInfo, getCollectionUserSettings } from '../../../shared/db/mongo_collections'

const logger = getLogger()


export interface StartTelegramClientParams {
  userId: string
}

export const startTelegramClient = async ({
  userId,
}: StartTelegramClientParams) => {
  const collectionUserSettings = await getCollectionUserSettings()
  const query = { userId }
  const userSettings = await collectionUserSettings.findOne(query)

  try {
    const client = await connectTelegramClient(userId, userSettings)
    client.on('update', async (update) => {
      await onUpdateMessage(userId, update, false)
    })
  } catch (error: any) {
    logger.error(
      `telegram client connection failed`,
      {
        logCode: LogCode.TELEGRAM_CLIENT,
        userId,
        error,
      },
    )
  }
}

export const startTelegramClients = async () => {
  const collectionTelegramClientInfo = await getCollectionTelegramClientInfo()
  await collectionTelegramClientInfo.find().forEach((telegramClient) => {
    const { userId } = telegramClient
    startTelegramClient({
      userId,
    })
  })
}