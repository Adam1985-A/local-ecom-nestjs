import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, type StrategyOptionsWithRequest, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { UsersService } from '../users/users.service.js';
import type { JwtPayload } from '../common/type/pagination.types.js';
import { compareHash } from '../common/utils/hash.util.js';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {

  constructor(private configService: ConfigService, private usersService: UsersService) {
   const options: StrategyOptionsWithRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    ignoreExpiration: false,
    secretOrKey: configService.getOrThrow<string>('jwt.refreshSecret'),
    passReqToCallback: true,
  };

  super(options);
} 
  

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const user = await this.usersService.findByIdWithRefreshToken(payload.sub);
    if (!user || !user.isActive || !user.refreshTokenHash || !refreshToken)
      throw new UnauthorizedException('Access denied');
    const matches = await compareHash(refreshToken, user.refreshTokenHash);
    if (!matches) throw new UnauthorizedException('Access denied');
    return { id: user.id, email: user.email, role: user.role, refreshToken };
  }
}