import { z } from 'zod'
import { authedProcedure, t } from '../utils'
import { Event, send } from '../../../../../shared/pubsub/pusher_client'
import { getCollectionTelegramClientInfo, getCollectionUserSettings } from '../../../../../shared/db/mongo_collections'
import { TelegramConnectionStatus } from '../../../../../shared/types/models/TelegramClientInfo'

export const userSettingsRouter = t.router({

  fetch: authedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id
      const collectionUserSettings = await getCollectionUserSettings()

      const query = { userId }
      return await collectionUserSettings.findOne(query)
    }),

  updateMobile: authedProcedure
    .input(z.object({
      mobilePhoneNumber: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const { mobilePhoneNumber } = input
      const collectionUserSettings = await getCollectionUserSettings()

      const query = { userId }
      const update = { $set: { mobilePhoneNumber }}
      const options = { upsert: true }
      const updateResult = await collectionUserSettings.updateOne(query, update, options)

      send(Event.USER_MOBILE_UPDATED, {
        userId,
        mobilePhoneNumber,
      })

      return {
        updateResult,
      }
    }),

  updateTelegram: authedProcedure
    .input(z.object({
      telegramAppApiId: z.string().optional(),
      telegramAppApiHash: z.string().optional(),
      telegramAuthCode: z.string().optional(),
    }))
    .mutation(async ({ ctx, input: telegramSettings }) => {
      const userId = ctx.session.user.id
      const collectionUserSettings = await getCollectionUserSettings()
      const collectionTelegramClientInfo = await getCollectionTelegramClientInfo()

      const query = { userId }
      // TODO
      //  split into two endpoints (api creds + auth code)
      //  (or reset auth code if necessary)
      const update = { $set: { ...telegramSettings }}
      const options = { upsert: true }
      const updateResultUserSettings = await collectionUserSettings.updateOne(query, update, options)

      const updateTelegramClientInfo = { $set: {
          connectionEstablished: false,
          connectionStatus: TelegramConnectionStatus.CONNECTION_FAILED,
          lastMessageDate: 0,
      }}
      const updateResultTelegramClientInfo = await collectionTelegramClientInfo.updateOne(query, updateTelegramClientInfo, options)

      send(Event.USER_TELEGRAM_UPDATED, {
        userId,
        ...telegramSettings,
      })

      return {
        updateResultUserSettings,
        updateResultTelegramClientInfo,
      }
    }),
})
