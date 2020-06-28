import { SetMetadata, UseGuards, createParamDecorator } from '@nestjs/common';
import Roles from './roles';
import JwtAuthGuard from './jwr-auth.guard';
import RolesGuard from './roles.guard';

export const ForRoles = (...roles: Roles[]) => SetMetadata('roles', roles);
export const Authorize = () => UseGuards(JwtAuthGuard, RolesGuard);
export const GetUser = createParamDecorator((data, req) => req.args[0].user);
