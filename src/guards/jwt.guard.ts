import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      console.error('Missing Authorization header');
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.error('Missing token');
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      console.log('Decoded JWT Payload:', decoded);
      request.user = decoded;
      return true;
    } catch (error) {
      console.error('JWT verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
