/* eslint-disable prettier/prettier */
// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // Optional: Override handleRequest for custom error handling or logging
  // handleRequest(err, user, info, context: ExecutionContext) {
  //     // console.log('JWT Guard - User:', user);
  //     // console.log('JWT Guard - Error:', err);
  //     // console.log('JWT Guard - Info:', info);
  //     if (err || !user) {
  //         throw err || new UnauthorizedException('Could not authenticate with token');
  //     }
  //     return user;
  // }
}
