import { NextFunction, Request, Response } from "express";
import { cookiesAuthService } from "../services/CookiesAuthService";
import { User } from "../models/User";

class CookiesAuthController {
    login(req: Request, res: Response, next: NextFunction) {
        const user: User = req.body;
        cookiesAuthService.login(user).then(sessionId => {
            res.cookie("session_id", sessionId, {maxAge: 1000 * 60 * 30, httpOnly: true});
            res.send({sessionId});
        }).catch(e => {
            next(e);
        })
    };

    registrate(req: Request, res: Response, next: NextFunction) {
        const user: User = req.body;
        
        cookiesAuthService.registrate(user).then(sessionId => {
            res.cookie("session_id", sessionId, {maxAge: 1000 * 60 * 30, httpOnly: true});
            res.send({sessionId});
        }).catch(e => {
            next(e);
        })
    };

    logout(req: Request, res: Response, next: NextFunction) {
        const user: User = req.user!;
        cookiesAuthService.logout(user).then(() => {
            res.clearCookie("session_id");
            res.send();
        }).catch(e => {
            next(e);
        });
    };

    getUserInfo(req: Request, res: Response) {
        const user: User = req.user!;
        res.send(user);
    };
}

export const cookiesAuthController = new CookiesAuthController();