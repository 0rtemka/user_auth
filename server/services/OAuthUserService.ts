import { OAuthUser } from "../models/OAuthUser";
import { UserSession } from "../models/UserSession";
import { oauthUserRepository } from "../repositories/OAuthUserRepository";
import { oauthSessionService } from "./OAuthSessionService";

class OAuthUserService {
  async getByEmail(email: string): Promise<OAuthUser | undefined> {
    return oauthUserRepository.findByEmail(email);
  }

  async getBySessionId(sessionId: string): Promise<OAuthUser | undefined> {
    return oauthUserRepository.findBySessionId(sessionId);
  }

  async authenticate(user: OAuthUser): Promise<string> {
    const userFromDb: OAuthUser | undefined = await this.getByEmail(user.email);
    const userSession: UserSession | undefined =
      await oauthSessionService.getByUserId(userFromDb?.id!);

    if (userFromDb && userSession) {
      return oauthSessionService.update(userFromDb.id!);
    } else {
      if (!userFromDb) {
        user.registration_date = new Date(Date.now());
        const savedUser: OAuthUser = (await oauthUserRepository.save(user))[0];
        return oauthSessionService.create(savedUser.id!);
      } else {
        return oauthSessionService.create(userFromDb.id!);
      }
    }
  }
}

export const oauthUserService = new OAuthUserService();
