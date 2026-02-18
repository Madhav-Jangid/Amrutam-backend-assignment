import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '@workspace/common';
import { JwtUtil } from '@auth/utils/jwt.util';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new NotAuthorizedError();
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = JwtUtil.verifyToken(token);
    (req as any).user = payload;
    next();
  } catch (err) {
    throw new NotAuthorizedError();
  }
};
