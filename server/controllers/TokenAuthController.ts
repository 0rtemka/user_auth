import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { tokenAuthService } from "../services/TokenAuthService";

class TokenAuthController {
  async registrate(req: Request, res: Response, next: NextFunction) {
    const user: User = req.body;
    tokenAuthService
      .registrate(user)
      .then((userData) => {
        res.cookie("refresh_token", userData.refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        });
        res.send(userData);
      })
      .catch((err) => {
        next(err);
      });
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const user: User = req.body;
    tokenAuthService
      .login(user)
      .then((userData) => {
        res.cookie("refresh_token", userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });

        res.send(userData);
      })
      .catch((err) => {
        next(err);
      });
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.cookies;    
    tokenAuthService
      .refresh(refresh_token)
      .then((userData) => {
        res.cookie("refresh_token", userData.refreshToken, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
        });
        res.send(userData);
      })
      .catch((err) => {
        next(err);
      });
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { refresh_token } = req.cookies;
    tokenAuthService
      .logout(refresh_token)
      .then(() => {
        res.clearCookie("refresh_token");
        res.send();
      })
      .catch((err) => {
        next(err);
      });
  }

  async getUserInfo(req: Request, res: Response, next: NextFunction) {
    const user = req.user!;
    res.send(user);
  }
}

export const tokenAuthController = new TokenAuthController();
