import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import UserModule from '../user/user.module';
import AuthService from './auth.service';
import JwtStrategy from './jwt.strategy';
import RolesGuard from './roles.guard';
import EmailModule from '../email/email.module';
import AuthController from './auth.controller';

dotenv.config();

@Module({
  imports: [
    UserModule,
    PassportModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, JwtStrategy, RolesGuard],
  exports: [AuthService],
  controllers: [AuthController],
})
class AuthModule {}

export default AuthModule;
