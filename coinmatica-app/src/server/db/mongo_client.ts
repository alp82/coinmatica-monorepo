// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { Db, MongoClient, MongoClientOptions } from 'mongodb'
import { env } from '../../env/server.mjs'

// db connection client for next auth

const uri = env.MONGO_URL
const options: MongoClientOptions = {}

let mongoClient: MongoClient

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export let mongoConnectionPromise: Promise<MongoClient>

if (!env.MONGO_URL) {
  throw new Error("Please add your MONGO_URL to .env")
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (!global._mongoClientPromise) {
    mongoClient = new MongoClient(uri, options)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    global._mongoClientPromise = mongoClient.connect()
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  mongoConnectionPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  mongoClient = new MongoClient(uri, options)
  mongoConnectionPromise = mongoClient.connect()
}

// db connection client for app code

let database: Db

export const getDB = async () => {
  if (database) return database

  if (!mongoClient) {
    mongoClient = new MongoClient(uri, options)
  }

  await mongoClient.connect();
  database = mongoClient.db(env.MONGO_DB);
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