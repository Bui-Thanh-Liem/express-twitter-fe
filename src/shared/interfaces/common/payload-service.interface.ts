import { IVideo } from '../schemas/video.interface'

export interface IPayloadCreateVideo extends Pick<IVideo, 'name' | 'size' | 'user_id'> {}
