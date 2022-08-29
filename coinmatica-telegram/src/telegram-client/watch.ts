import { startTelegramClient } from './init'
import { getLogger } from '../../../shared/log/winston_client'
import { LogCode } from '../../../shared/log/logCode'
import { Event, on } from '../../../shared/pubsub/pusher_client'

const logger = getLogger()

const reconnectTelegramClient = (userId: string) => {
  try {
    startTelegramClient({ userId })
  } catch (error) {
    logger.error('telegram client restart failed', {
      logCode: LogCode.TELEGRAM_CLIENT,
      userId,
    })
  }
}

export const watchTelegramClientInfo = () => {
  on(Event.USER_MOBILE_UPDATED, (data) => {
    reconnectTelegramClient(data.userId)
  })

  on(Event.USER_TELEGRAM_UPDATED, (data) => {
    reconnectTelegramClient(data.userId)
  })
}