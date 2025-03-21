import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { IS_PUBLIC_KEY } from './auth.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
        context.getHandler(),
        context.getClass(),
      ]);
      if (isPublic) {
        return true;
      }
      
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Missing token');
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new UnauthorizedException('Missing JWT secret');
      }
      const decoded = jwt.verify(token, secret);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
