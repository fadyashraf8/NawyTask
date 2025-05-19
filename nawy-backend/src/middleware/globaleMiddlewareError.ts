import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
}

export const globalMiddleWare = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Global Error Handler:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ error: err.message, statusCode });
};