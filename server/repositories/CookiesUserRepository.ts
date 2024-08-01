import { pg } from "../db/pg";
import { User } from "../models/User";

const Users = () => pg<User>("cookies_users");

class CookiesUserRepository {
  async findById(id: number): Promise<User | undefined> {
    return Users().where("id", "=", id).first();
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return Users().where("login", "=", login).first();
  }

  async findBySessionId(sessionId: string): Promise<User | undefined> {
    return Users().select("cookies_users.*")
      .join("sessions", "sessions.user_id", "=", "cookies_users.id")
      .where("session_id", "=", sessionId)
      .first();    
  }

  async save(user: User): Promise<User[]> {
    return Users().insert(user).returning("*");
  }
}

export const cookiesUserRepository = new CookiesUserRepository();
