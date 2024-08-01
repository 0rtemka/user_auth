import { pg } from "../db/pg";
import { OAuthUser } from "../models/OAuthUser";

const Users = () => pg<OAuthUser>("oauth_users");

class OAuthUserRepository {
  async findByEmail(email: string): Promise<OAuthUser | undefined> {
    return Users().where("email", "=", email).first();
  }

  async findBySessionId(sessionId: string): Promise<OAuthUser | undefined> {
    return Users()
      .select("oauth_users.*")
      .join("oauth_sessions", "oauth_sessions.user_id", "=", "oauth_users.id")
      .where("session_id", "=", sessionId)
      .first();    
  }

  async save(user: OAuthUser): Promise<OAuthUser[]> {
    return Users().insert(user).returning("*");
  }
}

export const oauthUserRepository = new OAuthUserRepository();