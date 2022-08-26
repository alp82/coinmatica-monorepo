import { getDB } from './mongo_client'
import { UserSettings } from '../types/models/UserSettings'
import { TelegramClientInfo } from '../types/models/TelegramClientInfo'
import { getLogger, LogCode } from '../log/logtail_client'

const logger = getLogger()

export enum Collection {
  // LOGS = 'logs',
  // SIGNALS = 'signals',
  TELEGRAM_CLIENT_INFO = 'telegram-client-info',
  USER_SETTINGS = 'user-settings',
}

const createCollectionIfNotExisting = async (collection: Collection) => {
  const db = await getDB()
  try {
    await db.createCollection(collection)
    logger.debug(`Created missing MongoDB collection "${collection}"`, {
      logCode: LogCode.DB,
    })
  } catch(error) {
  }
}

export const getCollectionUserSettings = async () => {
  const db = await getDB()
  const collection = Collection.USER_SETTINGS
  await createCollectionIfNotExisting(collection)
  return db.collection<UserSettings>(collection)
}

export const getCollectionTelegramClientInfo = async () => {
  const db = await getDB()
  const collection = Collection.TELEGRAM_CLIENT_INFO
  await createCollectionIfNotExisting(collection)
  return db.collection<TelegramClientInfo>(collection)
}