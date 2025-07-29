import { ObjectId } from 'mongodb'
import { IBase } from './base.interface'

export interface ILike extends IBase {
  user_id: ObjectId
  tweet_id: ObjectId
}
