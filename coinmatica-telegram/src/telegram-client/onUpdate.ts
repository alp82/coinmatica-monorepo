import { Update as Td$Update } from 'tdlib-types'

export type OnUpdate = (userId: string, update: Td$Update, ignoreLastMessageDateUpdate: boolean) => Promise<void>

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