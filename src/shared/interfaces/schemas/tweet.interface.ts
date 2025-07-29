import { ETweetType } from '~/shared/enums/type.enum'
import { IBase } from './base.interface'
import { ETweetAudience } from '~/shared/enums/common.enum'
import { IMedia } from '../common/media.interface'
import { ObjectId } from 'mongodb'

export interface ITweet extends IBase {
  user_id: ObjectId
  type: ETweetType
  audience: ETweetAudience
  content: string
  parent_id: null | ObjectId // null khi là tweet gốc
  hashtags: ObjectId[]
  mentions: ObjectId[] // nhắc đến
  medias: IMedia[]
  guest_view: number
  user_view: number
}
