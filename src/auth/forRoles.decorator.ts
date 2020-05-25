import { SetMetadata } from '@nestjs/common';
import { Roles as UsersRoles } from './roles';

export const ForRoles = (...roles: UsersRoles[]) => SetMetadata('roles', roles);
