import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(login: string, password: string): Promise<boolean> {
    const user = await this.usersService.findByLogin(login);
    if(!user) {
      return false;
    }
    return user.comparePassword(password);
  }

}
