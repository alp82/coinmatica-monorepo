import { createLogger, addColors, format, Logger, transports } from 'winston'
import 'winston-mongodb'
import SlackHook from 'winston-slack-webhook-transport'
import LogzioWinstonTransport from 'winston-logzio'

export let logger: Logger

const logLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
  },
  colors: {
    error: 'bold white redBG',
    // error: 'red',
    warn: 'yellow',
    info: 'blue',
    // debug: 'magenta',
    debug: 'dim grey',
  }
}

const initLogger = () => {
  logger = createLogger({
    levels: logLevels.levels,
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
      format.metadata(),
      format.prettyPrint(),
    ),
    defaultMeta: {
      service: 'coinmatica',
    },
    transports: [
      //
      // - Write to all logs with level `info` and below to `quick-start-combined.log`.
      // - Write all logs error (and below) to `quick-start-error.log`.
      //
      // new transports.File({filename: 'log/error.log', level: 'error'}),
      // new transports.File({filename: 'log/combined.log'}),
      new transports.Console({
        format: format.combine(
          format.colorize(),
          format.simple()
        )
      }),
      new transports.MongoDB({
        level: 'debug',
        db: process.env.MONGO_URL || '',
        collection: 'logs',
        storeHost: true,
        expireAfterSeconds: 60 * 60 * 24 * 7,
        options: { useUnifiedTopology: true },
      }),
      new SlackHook({
        webhookUrl: process.env.SLACK_WEBHOOK_LOGS || '',
        mrkdwn: true,
        formatter: (info) => {
          return {
            text: `*${info.level}*: ${info.message}`,
          }
        }
      }),
      new LogzioWinstonTransport({
        level: 'debug',
        name: 'winston_logzio',
        token: process.env.LOGZIO_TOKEN || '',
        host: 'listener.logz.io',
      }),
    ]
  })

  addColors(logLevels.colors)
}

export const getLogger = () => {
  if (!logger) {
    initLogger()
  }

  return logger
}