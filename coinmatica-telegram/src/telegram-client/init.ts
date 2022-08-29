import Client from 'tdl'
import { Update as Td$Update } from 'tdlib-types'

import { connectTelegramClient } from './connect'
import { getLogger } from '../../../shared/log/winston_client'
import { LogCode } from '../../../shared/log/logCode'
import { getCollectionTelegramClientInfo, getCollectionUserSettings } from '../../../shared/db/mongo_collections'

const logger = getLogger()

export type OnUpdate = (userId: string, update: Td$Update, ignoreLastMessageDateUpdate: boolean) => Promise<void>

export interface StartTelegramClientParams {
  userId: string
  onUpdate: OnUpdate
}

export const startTelegramClient = async ({
  userId,
  onUpdate
}: StartTelegramClientParams) => {
  const collectionUserSettings = await getCollectionUserSettings()
  const query = { userId }
  const userSettings = await collectionUserSettings.findOne(query)

  try {
    const client = await connectTelegramClient(userId, userSettings)
    client.on('update', async (update) => {
      await onUpdate(userId, update, false)
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

export const onUpdateMessage: OnUpdate = async (userId, telegramUpdate, ignoreLastMessageDateUpdate) => {
  // logger.debug(
  //   `new telegram message`,
  //   {
  //     logCode: LogCode.TELEGRAM_UPDATE,
  //     telegramUpdate: JSON.parse(JSON.stringify(telegramUpdate)),
  //   },
  // )
  // await storeMessage({
  //   userId,
  //   telegramUpdate,
  //   ignoreLastMessageDateUpdate,
  // })
}

export const startTelegramClients = async () => {
  const collectionTelegramClientInfo = await getCollectionTelegramClientInfo()
  await collectionTelegramClientInfo.find().forEach((telegramClient) => {
    const { userId } = telegramClient
    startTelegramClient({
      userId,
      onUpdate: onUpdateMessage,
    })
  })
}