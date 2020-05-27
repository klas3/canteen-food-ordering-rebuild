import { Repository, EntityRepository } from "typeorm";
import { User } from "../entity/User";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async getById(id: string): Promise<User | undefined> {
    return await this.findOne({ id });
  }

  async isLoginUnique(login: string): Promise<boolean> {
    return await this.findOne({ login }) === undefined;
  }

  async isEmailUnique(email: string): Promise<boolean> {
    return await this.findOne({ email }) === undefined;
  }
  
  async getEmailById(id: string): Promise<string> {
    const { email } = await this.findOne(id) as User;
    return email;
  }

  async setPushToken(pushToken: string, id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.update(id, { ...user, pushToken });
  }

  async getByLogin(login: string): Promise<User | undefined> {
    return await this.findOne({ login });
  }

  async setResetCode(resetCode: string, id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.update(id, { ...user, resetCode });
  }

  async clearResetCode(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.update(id, { ...user, resetCode: undefined });
  }
}
