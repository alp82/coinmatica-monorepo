import { z } from "zod";
import { t } from "../utils";
import { getCollectionUserSettings } from '../../db/mongo_collections'

export const userSettingsRouter = t.router({

  fetch: t.procedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      const { userId } = input
      const collectionUserSettings = await getCollectionUserSettings()

      const query = { userId }
      return await collectionUserSettings.findOne(query)
    }),

  updateMobile: t.procedure
    .input(z.object({
      userId: z.string(),
      mobilePhoneNumber: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { userId, mobilePhoneNumber } = input
      const collectionUserSettings = await getCollectionUserSettings()

      const query = { userId }
      const update = { $set: { mobilePhoneNumber }};
      const options = { upsert: true };
      const updateResult = await collectionUserSettings.updateOne(query, update, options);

      return {
        updateResult,
      }
    }),

  updateTelegram: t.procedure
    .input(z.object({
      userId: z.string(),
      telegramAppApiId: z.string().optional(),
      telegramAppApiHash: z.string().optional(),
      telegramAuthCode: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { userId, ...telegramSettings } = input
      const collectionUserSettings = await getCollectionUserSettings()

      const query = { userId }
      const update = { $set: { ...telegramSettings }};
      const options = { upsert: true };
      const updateResult = await collectionUserSettings.updateOne(query, update, options);

      return {
        updateResult,
      }
    }),
})
