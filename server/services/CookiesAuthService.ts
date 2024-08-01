import { ApiError } from "../errors/ApiError";
import { User } from "../models/User";
import { UserSession } from "../models/UserSession";
import { sessionRepository } from "../repositories/SessionRepository";
import { cookiesUserRepository } from "../repositories/CookiesUserRepository";
import bcrypt from "bcrypt";

class CookiesAuthService {
  async registrate(user: User): Promise<string> {
    const userFromDb: User | undefined = await cookiesUserRepository.findByLogin(
      user.login
    );
    if (userFromDb) {
      throw ApiError.badRequest("Пользователь с таким именем уже существует");
    }

    user.password = await bcrypt.hash(user.password, 12);
    user.registration_date = new Date(Date.now());

    const savedUser: User = (await cookiesUserRepository.save(user))[0];
    const sessionId: string = crypto.randomUUID();

    await sessionRepository.save({
      user_id: savedUser.id!,
      session_id: sessionId,
      exp: Date.now() + 1000 * 60 * 30, // 1800 секунд = 30 минут
    });

    return sessionId;
  }

  async login(user: User): Promise<string> {
    const userFromDb: User | undefined = await cookiesUserRepository.findByLogin(
      user.login
    );

    if (
      !userFromDb ||
      !(await bcrypt.compare(user.password, userFromDb.password))
    ) {
      throw ApiError.badRequest("Неверный логин или пароль");
    }

    const sessionId: string = crypto.randomUUID();

    const session: UserSession | undefined = await sessionRepository.findByUserId(userFromDb.id!);

    const newSession: UserSession = {
      user_id: userFromDb.id!,
      session_id: sessionId,
      exp: Date.now() + 1000 * 60 * 30, // 1800 секунд = 30 минут
    };

    if (session) {
      await sessionRepository.update(newSession);
    } else {
      await sessionRepository.save(newSession);
    }

    return sessionId;
  }

  async logout(user: User): Promise<void> {
    return await sessionRepository.remove(user.id!);
  }
}

export const cookiesAuthService = new CookiesAuthService();
