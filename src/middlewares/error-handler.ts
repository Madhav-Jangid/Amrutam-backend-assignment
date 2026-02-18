import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors';
import { sendError } from '../utils/response-handler';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return sendError(res, err.serializeErrors(), err.statusCode);
  }

  console.error(err);
  return sendError(res, [{ message: 'Something went wrong' }], 400);
};
