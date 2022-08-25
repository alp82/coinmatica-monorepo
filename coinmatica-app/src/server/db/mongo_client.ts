import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import { env } from '../../env/server.mjs'

let client: MongoClient
let connectionPromise: Promise<MongoClient>
let database: Db

export const getConnectionPromise = () => {
  if (!client) {
    client = new MongoClient(env.MONGO_URL)
  }

  if (!connectionPromise) {
    connectionPromise = client.connect()
  }

  return connectionPromise
}

export const getDB = async () => {
  if (database) return database

  await getConnectionPromise()
  database = client.db(env.MONGO_DB);
  await database.command({ ping: 1 })
  // logger.info('MongoDB connected successfully', { metadata: {
  //     logCode: LogCode.DB,
  //   }})

  // logger.error('MongoDB connection failed', {
  //   metadata: {
  //     logCode: LogCode.DB,
  //     error,
  //   }
  // })

  return database
}