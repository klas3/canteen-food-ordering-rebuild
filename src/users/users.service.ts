import { Injectable } from '@nestjs/common';
import { User } from '../entity/User';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

	async getById(id: string): Promise<User | undefined> {
		return await this.usersRepository.getById(id);
	}

	async isLoginUnique(login: string): Promise<boolean> {
		return await this.usersRepository.isLoginUnique(login);
	}

	async isEmailUnique(email: string): Promise<boolean> {
		return await this.usersRepository.isEmailUnique(email);
	}

	async getEmailById(id: string): Promise<string> {
		return await this.usersRepository.getEmailById(id);
	}

	async setPushToken(pushToken: string, id: string): Promise<void> {
		await this.usersRepository.setPushToken(pushToken, id);
	}

	async getByLogin(login: string): Promise<User | undefined> {
		return await this.usersRepository.getByLogin(login);
	}

	async setResetCode(resetCode: string, id: string): Promise<void> {
		await this.usersRepository.setResetCode(resetCode, id);
	}

	async clearResetCode(id: string): Promise<void> {
		await this.usersRepository.clearResetCode(id);
	}
}
