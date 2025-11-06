import type { IBase } from "./base.interface";
import type { ITrending } from "./trending.interface";
import type { IUser } from "./user.interface";

export interface ISearchHistory extends IBase {
  owner: string;

  // Dữ liệu đã search
  text?: string;
  trending?: string | ITrending;
  user?: string | IUser;
}
