import express from "express";
import { oauthController } from "../controllers/OAuthController";
import { oauthSessionHandler } from "../middlewares/oauthSessionHandler";

export const OAuthRouter = express.Router();

OAuthRouter.get("/auth", oauthController.authenticate);
OAuthRouter.get("/google/callback", oauthController.tokenInfo);
OAuthRouter.post("/logout", oauthSessionHandler, oauthController.logout);
OAuthRouter.get("/userinfo", oauthSessionHandler, oauthController.getUserInfo);
