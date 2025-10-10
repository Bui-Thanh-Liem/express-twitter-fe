import type { IBase } from "./base.interface";

export interface IFollower extends IBase {
  user_id: string; // User này sẽ theo dõi followed_user_id
  followed_user_id: string;
}
