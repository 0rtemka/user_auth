import { User } from "../models/User";
import { cookiesUserRepository } from "../repositories/CookiesUserRepository";

class CookiesUserService {
    async getByLogin(login: string): Promise<User | undefined> {
        return cookiesUserRepository.findByLogin(login);
    };

    async getById(id: number): Promise<User | undefined> {
        return cookiesUserRepository.findById(id);
    }

    async add(user: User): Promise<User[]> {
        return cookiesUserRepository.save(user);
    };
}

export const cookiesUserService = new CookiesUserService();