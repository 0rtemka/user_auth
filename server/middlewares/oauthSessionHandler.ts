import { NextFunction, Request, Response } from "express";
import { UserSession } from "../models/UserSession";
import { ApiError } from "../errors/ApiError";
import { OAuthUser } from "../models/OAuthUser";
import { oauthUserService } from "../services/OAuthUserService";
import { oauthSessionService } from "../services/OAuthSessionService";

declare module "express-serve-static-core" {
  interface Request {
    oauthUser?: OAuthUser;
  }
}

export async function oauthSessionHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { oauth_session } = req.cookies;    
    if (!oauth_session) {
      throw ApiError.unauthorized("Пользователь не аутентифицирован");
    }

    const user: OAuthUser | undefined = await oauthUserService.getBySessionId(
      oauth_session
    );
    if (!user) {
      throw ApiError.unauthorized("Пользователь не аутентифицирован");
    }

    const session: UserSession | undefined =
      await oauthSessionService.getBySessionId(oauth_session);
    if (Date.now() > session!.exp) {
      throw ApiError.unauthorized("Время действия сессии истекло");
    }

    req.oauthUser = user;
    next();
  } catch (e) {
    next(e);
  }
}
