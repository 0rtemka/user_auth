import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { oauthUserService } from "../services/OAuthUserService";
import { oauthSessionService } from "../services/OAuthSessionService";

dotenv.config();

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CALLBACK_URL = "http://localhost:5000/oauth/google/callback";
const GOOGLE_OAUTH_SCOPES = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;

class OAuthController {
  authenticate(req: Request, res: Response, next: NextFunction): void {    
    const state = "some_state";
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;    
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
  }

  async tokenInfo(req: Request, res: Response, next: NextFunction) {    
    const { code } = req.query;
    const data = {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:5000/oauth/google/callback",
      grant_type: "authorization_code",
    };
    
    const response = await fetch(GOOGLE_ACCESS_TOKEN_URL!, {
      method: "POST",
      body: JSON.stringify(data),
    });

    const access_token_data: any = await response.json();
    const { id_token } = access_token_data;

    const token_info_response = await fetch(
      `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`
    );    

    const userData: any = await token_info_response.json();

    oauthUserService
      .authenticate({
        login: userData.name,
        email: userData.email,
      })
      .then((sessionId) => {
        res.cookie("oauth_session", sessionId, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 день
        });
        res.redirect("http://localhost:5173/oauth");
      })
      .catch((err) => {
        next(err);
      });
  }

  logout(req: Request, res: Response, next: NextFunction) {
    const user = req.oauthUser!;
    oauthSessionService
      .logout(user) 
      .then(() => {
        res.clearCookie("oauth_session");
        res.send();
      })
      .catch((err) => {
        next(err);
      });
  }

  getUserInfo(req: Request, res: Response, next: NextFunction) {
    const user = req.oauthUser!;
    res.send(user);
  }
}

export const oauthController = new OAuthController();
