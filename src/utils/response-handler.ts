import { Response } from 'express';

export interface SuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  errors: { message: string; field?: string }[];
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string = 'Operation successful',
  statusCode: number = 200
) => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  errors: { message: string; field?: string }[],
  statusCode: number = 400
) => {
  const response: ErrorResponse = {
    success: false,
    errors,
  };
  return res.status(statusCode).json(response);
};
