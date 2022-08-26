import Pusher from 'pusher'
import PusherClient, { Channel as PusherChannel } from 'pusher-js'
import { getLogger, LogCode } from '../log/logtail_client'

const logger = getLogger()
let pusher: Pusher

export enum Channel {
  USER_SETTINGS = 'user-settings'
}

export enum Event {
  USER_MOBILE_UPDATED = 'mobile-updated',
  USER_TELEGRAM_UPDATED = 'telegram-updated',
}

export const EventChannel = {
  [Event.USER_MOBILE_UPDATED]: Channel.USER_SETTINGS,
  [Event.USER_TELEGRAM_UPDATED]: Channel.USER_SETTINGS,
}

export type EventData = {
  [Event.USER_MOBILE_UPDATED]: {
    userId: string
    mobilePhoneNumber: string
  }
  [Event.USER_TELEGRAM_UPDATED]: {
    userId: string
    telegramAppApiId?: string
    telegramAppApiHash?: string
    telegramAuthCode?: string
  }
}

export const getPusher = () => {
  if (pusher) return pusher

  try {
    pusher = new Pusher({
      appId: process.env.SOKETI_APP_ID || '',
      key: process.env.SOKETI_APP_KEY || '',
      secret: process.env.SOKETI_APP_SECRET || '',
      host: `${process.env.SOKETI_HOST}:${process.env.SOKETI_PORT}`,
      useTLS: false,
    })
  } catch (error: any) {
    logger.error(
      `pusher/soketi connection failed`,
      {
        logCode: LogCode.EVENT,
        host: process.env.SOKETI_HOST || '',
        port: process.env.SOKETI_PORT || '',
        error,
      }
    )
  }
  return pusher
}

export const send = async <T extends Event>(event: T, data: EventData[T]) => {
  const pusher = getPusher()
  const channel = EventChannel[event]
  try {
    await pusher.trigger(
      channel,
      event,
      data,
    )
    logger.info(
      `event: ${event} (${channel})`,
      {
        logCode: LogCode.EVENT,
        channel,
        event,
        data,
      }
    )
  } catch (error: any) {
    logger.error(
      `sending event failed`,
      {
        logCode: LogCode.EVENT,
        channel,
        event,
        data,
        error,
      }
    )
  }
}

let pusherClient: PusherClient
const subscriptions: Record<string, PusherChannel> = {}

export const getPusherClient = () => {
  if (pusherClient) return pusherClient

  try {
    pusherClient = new PusherClient(process.env.SOKETI_APP_KEY || '',{
      wsHost: process.env.SOKETI_HOST || '',
      wsPort: Number.parseInt(process.env.SOKETI_PORT || ''),
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
    })
  } catch (error: any) {
    logger.error(
      `pusher/soketi connection failed`,
      {
        logCode: LogCode.EVENT,
        host: process.env.SOKETI_HOST || '',
        port: process.env.SOKETI_PORT || '',
        error,
      }
    )
  }

  return pusherClient
}

export const on = <T extends Event>(event: T, callback: (data: EventData[T]) => void) => {
  const pusher = getPusherClient()

  if (!subscriptions[EventChannel[event]]) {
    subscriptions[EventChannel[event]] = pusher.subscribe(EventChannel[event])
  }
  const channel = subscriptions[EventChannel[event]]

  if (!channel) {
    logger.error(
      `subscription failed: pusher channel ${EventChannel[event]} does not exist`,
      {
        logCode: LogCode.EVENT,
        channel: EventChannel[event],
        event,
      }
    )
    return
  }

  channel.bind(event, callback)
}
