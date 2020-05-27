import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(login: string, password: string): Promise<{}> {
    const user = await this.usersService.getByLogin(login);
    if (!user || !user.comparePassword(password)) {
      throw new UnauthorizedException();
    }
    const payload = { 
      login: user.login,
      password: user.password,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
