import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../auth/roles';
import { Authorize, GetUser } from '../auth/auth.decorators';
import { User } from '../entity/User';

@Authorize()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('role')
  async getRole(@GetUser() user: User): Promise<{ role: Roles }> {
    return { role: (await this.userService.getById(user.id))?.role as Roles };
  }

  @Get('info')
  async getInfo(@GetUser() user: User): Promise<{ email: string, login: string }> {
    return { email: user.email, login: user.login };
  }

  @Get('id')
  async getId(@GetUser() user: User): Promise<{ id: string }> {
    return { id: user.id };
  }

  @Get('checkForAuthorization')
  async CheckIfUserAlreadyAuthorized(): Promise<void> {
    return;
  }
}
