import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError, ForbiddenError } from '@workspace/common';

export const authorize = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user) {
      throw new NotAuthorizedError();
    }

    const hasPermission = requiredPermissions.every(permission =>
      (req as any).user.permissions.includes(permission)
    );

    if (!hasPermission) {
      throw new ForbiddenError();
    }

    next();
  };
};
