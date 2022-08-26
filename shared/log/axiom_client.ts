import { Logtail } from '@logtail/node'

let client: Logtail

export const getLogger = () => {
  if (client) return client
  client = new Logtail(process.env.LOGTAIL_TOKEN || '')
  return client
}
