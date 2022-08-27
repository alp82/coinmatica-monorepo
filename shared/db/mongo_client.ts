import { Db, MongoClient } from 'mongodb'
import { getLogger, LogCode } from '../log/logtail_client'

const logger = getLogger()
let client: MongoClient
let connectionPromise: Promise<MongoClient>
let database: Db

export const getConnectionPromise = () => {
  if (!client) {
    try {
      client = new MongoClient(process.env.MONGO_URL || '')
    } catch (error: any) {
      logger.error('MongoDB client could not be initialized', {
        logCode: LogCode.DB,
        error,
      })
    }
  }

  if (!connectionPromise) {
    connectionPromise = client.connect()
  }

  return connectionPromise
}

export const getDB = async () => {
  if (database) return database

  await getConnectionPromise()
  try {
    database = client.db(process.env.MONGO_DB);
    await database.command({ ping: 1 })
  } catch (error: any) {
    logger.error('MongoDB connection failed', {
      logCode: LogCode.DB,
      error,
    })
  }


  return database
}