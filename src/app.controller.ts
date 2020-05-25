import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AppController {
  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Request() req: any) {
    return req.user;
  }
}