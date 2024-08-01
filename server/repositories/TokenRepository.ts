import { pg } from "../db/pg";
import { UserToken } from "../models/UserToken";

const Tokens = () => pg<UserToken>("tokens");

class TokenRepository {
  async findByUserId(userId: number): Promise<UserToken | undefined> {
    return Tokens().where("user_id", "=", userId).first();
  }

  async findByToken(token: string): Promise<UserToken | undefined> {
    return Tokens().where("token", "=", token).first();
  }

  async save(token: UserToken): Promise<void> {
    return Tokens().insert(token);
  }

  async update(token: UserToken): Promise<void> {
    return Tokens().where("user_id", "=", token.user_id).update(token);
  }

  async remove(token: string): Promise<void> {
    return Tokens().where("token", "=", token).del();
  }
}

export const tokenRepository = new TokenRepository();
