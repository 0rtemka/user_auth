import { pg } from "../db/pg";
import { UserSession } from "../models/UserSession";

const Sessions = () => pg<UserSession>("sessions");

class SessionRepository {
  findByUserId(userId: number): Promise<UserSession | undefined> {
    return Sessions().where("user_id", "=", userId).first();
  }

  findBySessionId(sessionId: string): Promise<UserSession | undefined> {
    return Sessions().where("session_id", "=", sessionId).first();
  }

  save(session: UserSession): Promise<string> {
    return Sessions().insert(session).returning("session_id");
  }

  update(session: UserSession): Promise<string> {
    return Sessions()
      .where("user_id", "=", session.user_id)
      .update(session)
      .returning("session_id");
  }

  remove(userId: number): Promise<void> {
    return Sessions().where("user_id", "=", userId).del();
  }
}

export const sessionRepository = new SessionRepository();
