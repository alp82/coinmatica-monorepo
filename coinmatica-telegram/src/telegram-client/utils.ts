import { getCollectionTelegramClientInfo } from '@shared/db/mongo_collections'
import { TelegramConnectionStatus } from '@shared/types/models/TelegramClientInfo'

export interface UpdateConnectionStatusParams {
  userId: string
  connectionEstablished: boolean
  connectionStatus: TelegramConnectionStatus
}

export const updateConnectionStatus = async ({
  userId,
  connectionEstablished,
  connectionStatus
}: UpdateConnectionStatusParams) => {
  const collectionTelegramClientInfo = await getCollectionTelegramClientInfo()
  const query = { userId };
  const update = { $set: {
      connectionEstablished,
      connectionStatus,
    }};
  const options = {};
  await collectionTelegramClientInfo.updateOne(query, update, options);
}