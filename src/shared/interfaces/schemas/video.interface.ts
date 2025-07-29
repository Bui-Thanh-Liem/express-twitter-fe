import { ObjectId } from 'mongodb'
import { EVideoStatus } from '~/shared/enums/status.enum'
import { IBase } from './base.interface'

export interface IVideo extends IBase {
  name: string
  size: number
  status: EVideoStatus
  user_id: ObjectId
}
