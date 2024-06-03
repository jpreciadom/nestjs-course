import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UserRolesGuard } from '../guards';

export function Authorize(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRolesGuard),
  )
}
