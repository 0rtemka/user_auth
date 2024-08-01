import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { tokenRepository } from "../repositories/TokenRepository";
import { User } from "../models/User";

dotenv.config();

class TokenService {
  generateTokens(payload: any) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_KEY_SECRET!, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_KEY_SECRET!, {
      expiresIn: "30d",
    });
    return {
      accessToken,
      refreshToken,
    };
  };

  async saveToken(userId: number, refreshToken: string): Promise<void> {
    const token = await tokenRepository.findByUserId(userId);
    if (token) {
      token.token = refreshToken;
      return await tokenRepository.update(token);
    }
    return await tokenRepository.save({ user_id: userId, token: refreshToken });
  };

  validateRefreshToken(token: string): User | null {
    try {
        const payload = jwt.verify(token, process.env.REFRESH_KEY_SECRET!);
        return payload as User;
    } catch(err) {
        return null;
    }
  };

  validateAccessToken(token: string): User | null {
    try {
        const payload = jwt.verify(token, process.env.ACCESS_KEY_SECRET!);
        return payload as User;
    } catch(err) {
        return null;
    }
  };

  async getByToken(token: string) {
    return tokenRepository.findByToken(token);
  }

  async removeToken(token: string) {
    await tokenRepository.remove(token);
  };
}

export const tokenService = new TokenService();