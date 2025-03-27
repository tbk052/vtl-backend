/* eslint-disable prettier/prettier */
// src/auth/strategies/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service'; // Important for fetching fresh user data if needed

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService, // Inject UsersService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Payload contains { email: user.email, sub: user.id, role: user.role, iat, exp }
    // You can optionally fetch the full user object here if needed for permissions
    // const user = await this.usersService.findOneById(payload.sub);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // return user; // Return full user object

    // Or just return the payload info if that's enough
    if (!payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException();
    }
    // We trust the payload because the signature was verified by passport-jwt
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
