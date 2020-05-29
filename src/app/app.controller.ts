import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Roles } from '../auth/roles';
import { ForRoles, Authorize } from '../auth/auth.decorators';
import { Connection } from 'typeorm';

@Authorize()
@ForRoles(Roles.Admin)
@Controller('test')
export class AppController {
  constructor(
    private authService: AuthService,
    private conn: Connection  
  ) {}

  @Get()
  get() {
    return 'Get action for customer!';
  }
}
