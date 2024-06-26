import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../entities';
import { META_ROLES } from '../decorators';

@Injectable()
export class UserRolesGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    if (!validRoles || validRoles.length === 0) return true

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) 
      throw new UnauthorizedException('User not found');

    for (const role of user.roles) 
      if (validRoles.includes(role))
        return true
    

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: [${validRoles.join(', ')}]`
    )
  }
}
