import Redis from "ioredis"

import { env } from '../../env/server.mjs'

let client: Redis

export const getRedisClient = () => {
  if (client) return client

  client = new Redis(env.REDIS_URL)
  return client
}
