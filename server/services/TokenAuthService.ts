import { ApiError } from "../errors/ApiError";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import { tokenUserService } from "./TokenUserService";
import { tokenService } from "./TokenService";

class TokenAuthService {
    async registrate(user: User) {
        const userFromDb = await tokenUserService.getByLogin(user.login);
        if (userFromDb) {
            throw ApiError.badRequest("Пользователь с таким логином уже зарегистрирован")
        };

        const hashPassword = await bcrypt.hash(user.password, 12);

        user.password = hashPassword;
        user.registration_date = new Date(Date.now());

        const savedUser = (await tokenUserService.add(user))[0];

        const tokens = tokenService.generateTokens(savedUser);
        await tokenService.saveToken(savedUser.id!, tokens.refreshToken);

        return {
            ...tokens,
            user: savedUser,
        }
    };

    async login(user: User) {
        const userFromDb = await tokenUserService.getByLogin(user.login);
        if (!userFromDb) {
            throw ApiError.badRequest("Неверный логин или пароль");
        };

        const isPasswordsEquals = await bcrypt.compare(user.password, userFromDb.password);
        if (!isPasswordsEquals) {
            throw ApiError.badRequest("Неверный логин или пароль");
        };

        const tokens = tokenService.generateTokens(userFromDb);
        await tokenService.saveToken(userFromDb.id!, tokens.refreshToken);

        return {
            ...tokens,
            user: userFromDb,
        };
    };

    async refresh(token: string) {
        if (!token) {
            throw ApiError.unauthorized("Пользователь не аутентифицирован");
        }

        const user = tokenService.validateRefreshToken(token);
        const tokenFromDb = tokenService.getByToken(token);

        if (!user || !tokenFromDb) {
            throw ApiError.unauthorized("Пользователь не аутентифицирован");
        }

        const userFromDb = await tokenUserService.getById(user.id!);

        const tokens = tokenService.generateTokens(userFromDb);
        await tokenService.saveToken(userFromDb!.id!, tokens.refreshToken);

        return {
            ...tokens,
            user: userFromDb,
        };
    };

    async logout(token: string) {
        return tokenService.removeToken(token);
    };
}

export const tokenAuthService = new TokenAuthService();