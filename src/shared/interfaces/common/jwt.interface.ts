import { ETokenType } from "~/shared/enums/type.enum";

export interface IJwtPayload {
  user_id: string;
  type: ETokenType;
}
