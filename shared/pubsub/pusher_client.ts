import Pusher from 'pusher'
import PusherClient, { Channel as PusherChannel } from 'pusher-js'

let pusher: Pusher

export enum Channel {
  USER_SETTINGS = 'user-settings'
}

export enum Event {
  USER_MOBILE_UPDATED = 'mobile-updated'
}

export const EventChannel = {
  [Event.USER_MOBILE_UPDATED]: Channel.USER_SETTINGS,
}

export type EventData = {
  [Event.USER_MOBILE_UPDATED]: {
    userId: string
    mobilePhoneNumber: string
  }
}

export interface PusherEnv {
  SOKETI_APP_ID: string
  SOKETI_APP_KEY: string
  SOKETI_APP_SECRET: string
  SOKETI_HOST: string
  SOKETI_PORT: number
}

export const getPusher = (env: PusherEnv) => {
  if (pusher) return pusher

  pusher = new Pusher({
    appId: env.SOKETI_APP_ID,
    key: env.SOKETI_APP_KEY,
    secret: env.SOKETI_APP_SECRET,
    host: `${env.SOKETI_HOST}:${env.SOKETI_PORT}`,
    useTLS: false,
  })

  return pusher
}

export const send = async <T extends Event>(event: T, data: EventData[T], env: PusherEnv) => {
  const pusher = getPusher(env)
  await pusher.trigger(
    EventChannel[event],
    event,
    data,
  )
}

let pusherClient: PusherClient
const subscriptions: Record<string, PusherChannel> = {}

export const getPusherClient = (env: PusherEnv) => {
  if (pusherClient) return pusherClient

  pusherClient = new PusherClient(env.SOKETI_APP_KEY,{
    wsHost: env.SOKETI_HOST,
    wsPort: env.SOKETI_PORT,
    forceTLS: false,
    disableStats: true,
    enabledTransports: ['ws', 'wss'],
  })

  return pusherClient
}

export const on = <T extends Event>(event: T, callback: (data: EventData[T]) => void, env: PusherEnv) => {
  const pusher = getPusherClient(env)

  if (!subscriptions[EventChannel[event]]) {
    subscriptions[EventChannel[event]] = pusher.subscribe(EventChannel[event])
  }
  const channel = subscriptions[EventChannel[event]]

  if (!channel) {
    throw Error(`channel ${EventChannel[event]} does not exist`)
  }

  channel.bind(event, callback)
}
