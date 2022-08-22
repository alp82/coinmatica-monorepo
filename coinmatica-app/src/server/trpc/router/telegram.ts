import { z } from 'zod'
import { t } from '../utils'
import { getCollectionTelegramClientInfo } from '../../db/mongo_collections'

export const telegramRouter = t.router({

  fetchClientInfo: t.procedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ input }) => {
      const { userId } = input
      const collectionTelegramClientInfo = await getCollectionTelegramClientInfo()

      const query = { userId }
      return await collectionTelegramClientInfo.findOne(query)
    }),
})
