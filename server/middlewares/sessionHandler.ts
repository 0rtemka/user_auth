import { NextFunction, Request, Response } from "express";
import { cookiesUserRepository } from "../repositories/CookiesUserRepository";
import { User } from "../models/User";
import { UserSession } from "../models/UserSession";
import { sessionRepository } from "../repositories/SessionRepository";
import { ApiError } from "../errors/ApiError";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export async function sessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {    
    const { session_id } = req.cookies;    
    if (!session_id) {
      throw ApiError.unauthorized("Пользователь не аутентифицирован");
    }
 
    const user: User | undefined = await cookiesUserRepository.findBySessionId(session_id);    
    if (!user) {
      throw ApiError.unauthorized("Пользователь не аутентифицирован");
    }

    const session: UserSession | undefined =
      await sessionRepository.findBySessionId(session_id);
    if (Date.now() > session!.exp) {
      throw ApiError.unauthorized("Время действия сессии истекло");
    }

    req.user = user;
    next();
  } catch (e) {
    next(e);
  }
}
