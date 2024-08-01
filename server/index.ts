import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import cors from "cors";
import { cookiesAuthRouter } from './routers/cookiesAuthRouter';
import { tokenAuthRouter } from './routers/tokenAuthRouter';
import { errorHandler } from './middlewares/errorHandler';
import { OAuthRouter } from './routers/OAuthRouter';

dotenv.config();

const PORT = process.env.PORT || '5000';
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser())
app.use("/cookie", cookiesAuthRouter);
app.use("/token", tokenAuthRouter);
app.use("/oauth", OAuthRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Приложение запущено на http://localhost:${PORT}`);
});
