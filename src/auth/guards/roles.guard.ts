/* eslint-disable prettier/prettier */
// src/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }
    const { user } = context.switchToHttp().getRequest();

    // Ensure user object and role exist (depends on JwtStrategy returning role)
    if (!user || !user.role) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
