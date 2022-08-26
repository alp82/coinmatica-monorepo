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

  pusher = new Pusher({
    appId: process.env.SOKETI_APP_ID || '',
    key: process.env.SOKETI_APP_KEY || '',
    secret: process.env.SOKETI_APP_SECRET || '',
    host: `${process.env.SOKETI_HOST}:${process.env.SOKETI_PORT}`,
    useTLS: false,
  })

  return pusher
}

export const send = async <T extends Event>(event: T, data: EventData[T]) => {
  const pusher = getPusher()
  const channel = EventChannel[event]
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
}

let pusherClient: PusherClient
const subscriptions: Record<string, PusherChannel> = {}

export const getPusherClient = () => {
  if (pusherClient) return pusherClient

  pusherClient = new PusherClient(process.env.SOKETI_APP_KEY || '',{
    wsHost: process.env.SOKETI_HOST || '',
    wsPort: Number.parseInt(process.env.SOKETI_PORT || ''),
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
  })

  return pusherClient
}

export const on = <T extends Event>(event: T, callback: (data: EventData[T]) => void) => {
  const pusher = getPusherClient()

  if (!subscriptions[EventChannel[event]]) {
    subscriptions[EventChannel[event]] = pusher.subscribe(EventChannel[event])
  }
  const channel = subscriptions[EventChannel[event]]

  if (!channel) {
    throw Error(`channel ${EventChannel[event]} does not exist`)
  }

  channel.bind(event, callback)
}
