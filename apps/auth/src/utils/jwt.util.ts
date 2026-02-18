import jwt from 'jsonwebtoken';
import { config } from '@auth/config/auth.config';

export class JwtUtil {
  static signToken(payload: any, expiresIn: any = config.jwt.accessExpiration): string {
    return jwt.sign(payload, config.jwt.secret as string, {
      expiresIn,
    });
  }

  static verifyToken(token: string): any {
    return jwt.verify(token, config.jwt.secret);
  }
}
