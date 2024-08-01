import express from "express"
import { cookiesAuthController } from "../controllers/CookiesAuthController";
import { sessionHandler } from "../middlewares/sessionHandler";

export const cookiesAuthRouter = express.Router();

cookiesAuthRouter.post("/login", cookiesAuthController.login);
cookiesAuthRouter.post("/registrate", cookiesAuthController.registrate);
cookiesAuthRouter.post("/logout", sessionHandler, cookiesAuthController.logout);
cookiesAuthRouter.get("/userinfo", sessionHandler, cookiesAuthController.getUserInfo);