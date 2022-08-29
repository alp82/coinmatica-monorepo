import { getCollectionTelegramClientInfo } from '@shared/db/mongo_collections'

export const readHistory = () => {
  const collectionTelegramClientInfo = await getCollectionTelegramClientInfo()
  const telegramClientInfo = await collectionTelegramClientInfo.findOne({ userId })
  const lastMonth = Math.floor(new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000).getTime() / 1000)
  const lastDate = telegramClientInfo?.lastMessageDate || lastMonth
  const history = await readWCSEHistory({ client, lastDate })

  if (history.length) {
    // note: forEach with async/await is not waiting
    for (let i=0; i < history.length; i++) {
      console.log(`history message ${i+1}/${history.length}`)
      logger.debug(`history message ${i+1}/${history.length}`)
      const message = history[i]
      // @ts-ignore
      await onUpdate(userId, message, true)
    }

    const lastMessageDate = history[history.length - 1].message.date
    await updateLastMessageDate({ userId, lastMessageDate })
  }

}