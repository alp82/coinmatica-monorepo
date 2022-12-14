export enum TelegramConnectionStatus {
  SUCCESS = 'SUCCESS',
  NOT_CONFIGURED = 'NOT_CONFIGURED',
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  MISSING_OR_WRONG_MOBILE_NUMBER = 'MISSING_OR_WRONG_MOBILE_NUMBER',
  MISSING_OR_WRONG_API_SETTINGS = 'MISSING_OR_WRONG_API_SETTINGS',
  MISSING_OR_WRONG_AUTH_CODE = 'MISSING_OR_WRONG_AUTH_CODE',
  MISSING_OR_WRONG_PASSWORD = 'MISSING_OR_WRONG_PASSWORD'
}

export interface TelegramClientInfo {
  userId: string
  connectionEstablished: boolean
  connectionStatus: TelegramConnectionStatus
  lastMessageDate: number
}
