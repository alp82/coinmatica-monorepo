import { Logtail } from '@logtail/node'

export enum LogCode {
  API = 'API',
  DB = 'DB',
  EVENT = 'EVENT',
  TELEGRAM_CLIENT = 'TELEGRAM_CLIENT',
}

let client: Logtail

export const getLogger = () => {
  if (client) return client
  try {
    client = new Logtail(process.env.LOGTAIL_TOKEN || '')
  } catch (error: any) {
    console.error(
      `logtail connection failed`,
      {
        logCode: LogCode.EVENT,
        error,
      }
    )
  }
  return client
}
