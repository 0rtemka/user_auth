import { pg } from "../db/pg";
import { UserSession } from "../models/UserSession";

const Sessions = () => pg<UserSession>("oauth_sessions");

class OAuthSessionRepository {
  async findByUserId(userId: number): Promise<UserSession | undefined> {
    return Sessions().where("user_id", "=", userId).first();
  }

  async findBySessionId(sessionId: string): Promise<UserSession | undefined> {
    return Sessions().where("session_id", "=", sessionId).first();
  }

  async save(session: UserSession): Promise<string> {
    return Sessions().insert(session).returning("session_id");
  }

  async update(session: UserSession): Promise<string> {
    return Sessions()
      .where("user_id", "=", session.user_id)
      .update(session)
      .returning("session_id");
  }

  async remove(userId: number): Promise<void> {
    return Sessions().where("user_id", "=", userId).del();
  }
}

export const oauthSessionRepository = new OAuthSessionRepository();
