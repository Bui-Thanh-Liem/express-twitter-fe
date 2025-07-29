import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/shared/enums/type.enum'

export interface IJwtPayload extends JwtPayload {
  user_id: string
  type: TokenType
}
