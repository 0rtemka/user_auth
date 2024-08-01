import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { ApiError } from "../errors/ApiError";
import { tokenService } from "../services/TokenService";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export function jwtHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next(ApiError.unauthorized("Пользователь не аутентифицирован"));
    }

    const accessToken = authHeader!.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.unauthorized("Пользователь не аутентифицирован"));
    }

    const user = tokenService.validateAccessToken(accessToken);
    if (!user) {
      return next(ApiError.unauthorized("Пользователь не аутентифицирован"));
    }

    req.user = user;
    next();
  } catch (err) {
      next(ApiError.internalServerError("Произошла непредвиденная ошибка"));
  }
}
