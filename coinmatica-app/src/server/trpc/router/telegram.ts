import { z } from 'zod'
import { authedProcedure, t } from '../utils'
import { getCollectionTelegramClientInfo } from '../../../../../shared/db/mongo_collections'

export const telegramRouter = t.router({

  fetchClientInfo: authedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id
      const collectionTelegramClientInfo = await getCollectionTelegramClientInfo()

      const query = { userId }
      return await collectionTelegramClientInfo.findOne(query)
    }),
})
