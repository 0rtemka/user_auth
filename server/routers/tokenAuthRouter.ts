import express from "express";
import { tokenAuthController } from "../controllers/TokenAuthController";
import { jwtHandler } from "../middlewares/jwtHandler";

export const tokenAuthRouter = express.Router();

tokenAuthRouter.post("/registrate", tokenAuthController.registrate);
tokenAuthRouter.post("/login", tokenAuthController.login);
tokenAuthRouter.post("/refresh", tokenAuthController.refresh);
tokenAuthRouter.post("/logout", tokenAuthController.logout);
tokenAuthRouter.get("/userinfo", jwtHandler, tokenAuthController.getUserInfo);