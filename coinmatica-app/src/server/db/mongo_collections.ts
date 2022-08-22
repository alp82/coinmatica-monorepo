import { getDB } from './mongo_client'
import { UserSettings } from '../../types/models/UserSettings'
import { TelegramClientInfo } from '../../types/models/TelegramClientInfo'

export enum Collection {
  // LOGS = 'logs',
  // SIGNALS = 'signals',
  TELEGRAM_CLIENT_INFO = 'telegram-client-info',
  USER_SETTINGS = 'user-settings',
}

export const getCollectionUserSettings = async () => {
  const db = await getDB()
  try {
    await db.createCollection(Collection.USER_SETTINGS)
    // logger.info(`Created missing MongoDB collection "${Collection.USER_SETTINGS}"`, { metadata: {
    //     logCode: LogCode.DB,
    //   }})
  } catch(error) {
  }
  return db.collection<UserSettings>(Collection.USER_SETTINGS)
}

export const getCollectionTelegramClientInfo = async () => {
  const db = await getDB()
  try {
    await db.createCollection(Collection.TELEGRAM_CLIENT_INFO)
    // logger.info(`Created missing MongoDB collection "${Collection.TELEGRAM_CLIENT_INFO}"`, { metadata: {
    //     logCode: LogCode.DB,
    //   }})
  } catch(error) {
  }
  return db.collection<TelegramClientInfo>(Collection.TELEGRAM_CLIENT_INFO)
}