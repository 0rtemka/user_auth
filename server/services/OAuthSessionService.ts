import crypto from "crypto";
import { oauthSessionRepository } from "../repositories/OAuthSessionRepository";
import { UserSession } from "../models/UserSession";
import { OAuthUser } from "../models/OAuthUser";

class OAuthSessionService {
  async getByUserId(userId: number): Promise<UserSession | undefined> {
    return await oauthSessionRepository.findByUserId(userId);
  }

  async getBySessionId(sessionId: string) {
    return await oauthSessionRepository.findBySessionId(sessionId);
  }

  async create(user_id: number): Promise<string> {
    const session_id = crypto.randomUUID();
    const exp = Date.now() + 24 * 60 * 60 * 1000; // 1 день
    await oauthSessionRepository.save({ user_id, session_id, exp });
    return session_id;
  }

  async update(user_id: number): Promise<string> {
    const session_id = crypto.randomUUID();
    const exp = Date.now() + 24 * 60 * 60 * 1000; // 1 день
    await oauthSessionRepository.update({ user_id, session_id, exp });
    return session_id;
  }

  async logout(user: OAuthUser): Promise<void> {
    return oauthSessionRepository.remove(user.id!);
  }
}

export const oauthSessionService = new OAuthSessionService();
