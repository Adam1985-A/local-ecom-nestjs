import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, type StrategyOptions, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service.js';
import type { JwtPayload } from '../common/type/pagination.types.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService, private usersService: UsersService) {
    const options: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.accessSecret'),
      
    };

    super(options);
  }

  async validate(payload: JwtPayload) {

  
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.isActive){ 
      
      throw new UnauthorizedException('User not found or inactive');
    }
    return { id: user.id, 
      email: user.email, 
      role: user.role, 
      firstName: user.firstName, 
      lastName: user.lastName 
    };
  }
}