import { User } from "../models/User";
import { tokenUserRepository } from "../repositories/TokenUserRepository";

class TokenUserService {
    async getByLogin(login: string): Promise<User | undefined> {
        return tokenUserRepository.findByLogin(login);
    };

    async getById(id: number): Promise<User | undefined> {
        return tokenUserRepository.findById(id);
    }

    async add(user: User): Promise<User[]> {
        return tokenUserRepository.save(user);
    };
}

export const tokenUserService = new TokenUserService();