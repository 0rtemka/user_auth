import { pg } from "../db/pg";
import { User } from "../models/User";

const Users = () => pg<User>("token_users");

class TokenUserRepository {
    async findByLogin(login: string): Promise<User | undefined> {
        return Users().where("login", "=", login).first();
    };

    async findById(id: number): Promise<User | undefined> {
        return Users().where("id", "=", id).first();
    }

    async save(user: User): Promise<User[]> {
        return Users().insert(user).returning("*");
    };
}

export const tokenUserRepository = new TokenUserRepository();