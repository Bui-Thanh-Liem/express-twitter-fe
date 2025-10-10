import type { IBase } from "./base.interface";

export interface IRefresh extends IBase {
  token: string;
  user_id: string;
  iat: Date | number | undefined;
  exp: Date | number | undefined;
}
