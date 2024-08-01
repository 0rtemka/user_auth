import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    res.status(err.status).send(err);
  } else {
    res
      .status(500)
      .send(ApiError.internalServerError(err.message));
  }
}
