import { env } from '../../env/server.mjs'

import Redis from "ioredis"

let client: Redis

export const getRedisClient = () => {
  if (client) return client

  client = new Redis(env.REDIS_URL)
  return client
}
