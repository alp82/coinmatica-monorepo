import Client from 'tdl'
import { UpdateResult } from 'mongodb'
import { UserSettings } from '../../../shared/types/models/UserSettings'
import { TelegramConnectionStatus } from '../../../shared/types/models/TelegramClientInfo'
import { getCollectionUserSettings } from '../../../shared/db/mongo_collections'
import { getLogger } from '../../../shared/log/winston_client'
import { LogCode } from '../../../shared/log/logCode'

const logger = getLogger()

export const login = async (client: Client, userId: string, userSettings: UserSettings) => {
  await client.login(() => ({
    type: 'user',
    getPhoneNumber: (retry?: boolean) => {
      if (retry) {
        return Promise.reject({
          connectionEstablished: false,
          connectionStatus: TelegramConnectionStatus.MISSING_OR_WRONG_MOBILE_NUMBER,
        })
      } else {
        return Promise.resolve(userSettings?.mobilePhoneNumber || '')
      }
    },
    getAuthCode: (retry?: boolean) => {
      if (retry) {
        return Promise.reject({
          connectionEstablished: false,
          connectionStatus: TelegramConnectionStatus.MISSING_OR_WRONG_AUTH_CODE,
        })
      } else {
        return Promise.resolve(userSettings?.telegramAuthCode || '')
      }
    },
    getPassword: (passwordHint: string, retry?: boolean) => {
      if (retry) {
        return Promise.reject({
          connectionEstablished: false,
          connectionStatus: TelegramConnectionStatus.MISSING_OR_WRONG_PASSWORD,
        })
      } else {
        return Promise.resolve('') // TODO pw?
      }
    },
    // getName: () => // TODO name?
    //   Promise.resolve({ firstName: 'Alper', lastName: 'Ortac' })
  }))
}

export const resetAuthTokenIfNeeded = async (userId: string): Promise<UpdateResult | undefined> => {
  // only if auth token is set, we need to reset it
  const collectionUserSettings = await getCollectionUserSettings()
  const query = { userId };
  const userSettings = await collectionUserSettings.findOne(query)

  if (!userSettings) {
    logger.error(`reset auth token failed: user settings for user ${userId} do not exist`, {
      logCode: LogCode.TELEGRAM_CLIENT,
      userId,
    })
    return
  }

  const authTokenExists = Boolean(userSettings.telegramAuthCode)
  if(!authTokenExists) return

  const update = { $set: { telegramAuthCode: '' }}
  const options = { upsert: true }
  const updateResult = await collectionUserSettings.updateOne(query, update, options)
  logger.debug(`telegram client auth code reset complete for user ${userId}`, {
    logCode: LogCode.TELEGRAM_CLIENT,
    userId,
  })

  return updateResult
}