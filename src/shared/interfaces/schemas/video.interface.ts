import { EVideoStatus } from "~/shared/enums/status.enum";
import type { IBase } from "./base.interface";

export interface IVideo extends IBase {
  name: string;
  size: number;
  status: EVideoStatus;
  user_id: string;
}
