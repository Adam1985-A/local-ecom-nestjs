import { ForbiddenException, Injectable } from '@nestjs/common';
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorator/roles.decorator.js';
import { UserRole } from '../enums/user.role.enum.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles || requiredRoles.length === 0) return true;
    const { user } = context.switchToHttp().getRequest();

console.log('========== ROLES DEBUG ==========');
console.log('REQUIRED ROLES:', requiredRoles);
console.log('USER:', user);
console.log('USER ROLE:', user?.role);
console.log('ROLE TYPE:', typeof user?.role);
console.log('ROLE MATCH:', requiredRoles?.includes(user?.role));
console.log('=================================');

 
      if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }
    return true;
  }
}
