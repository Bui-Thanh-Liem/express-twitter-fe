import type { ICommunity } from "~/shared/interfaces/schemas/community.interface";
import type { ITrending } from "~/shared/interfaces/schemas/trending.interface";
import type { IUser } from "~/shared/interfaces/schemas/user.interface";

export interface ResSearchPending {
  trending: ITrending[];
  users: IUser[];
  communities: ICommunity[];
}
