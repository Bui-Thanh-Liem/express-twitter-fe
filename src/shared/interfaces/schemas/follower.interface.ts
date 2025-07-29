import { ObjectId } from 'mongodb'
import { IBase } from './base.interface'

export interface IFollower extends IBase {
  user_id: ObjectId
  followed_user_id: ObjectId
}
