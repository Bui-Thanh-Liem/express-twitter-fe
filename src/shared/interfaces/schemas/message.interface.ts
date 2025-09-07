import { ObjectId } from 'mongodb'
import { IBase } from './base.interface'
import type { IConversation } from './conversation.interface'

export interface IMessage extends IBase {
  sender: ObjectId
  conversation: ObjectId | IConversation
  content: string
  attachments: string[]
}
