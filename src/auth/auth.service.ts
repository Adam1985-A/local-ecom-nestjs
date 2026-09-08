import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service.js';
import { User } from '../users/user.entity.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { compareHash, hashValue } from '../common/utils/hash.util.js';
import type { JwtPayload } from './interface/jwt-payload.interface.js';
import type { StringValue } from 'ms';

export interface AuthTokens { accessToken: string; refreshToken: string; }

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create(dto);
    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    const { password, refreshTokenHash, ...rest } = user;
    return { ...tokens, user: rest };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);
    if (!user) throw new UnauthorizedException('Invalid email or password');
    if (!user.isActive) throw new UnauthorizedException('Account has been deactivated');
    const ok = await compareHash(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid email or password');
    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    const { password, refreshTokenHash, ...rest } = user;
    return { ...tokens, user: rest };
  }

  async refreshTokens(userId: string, refreshToken: string): Promise<AuthTokens> {
    const user = await this.usersService.findByIdWithRefreshToken(userId);
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException('Access denied');
    const matches = await compareHash(refreshToken, user.refreshTokenHash);
    if (!matches) throw new UnauthorizedException('Access denied');
    const tokens = await this.getTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {

  const me = await this.usersService.findById(userId);

     if (!me) {
    throw new UnauthorizedException('User not found');
  }

    const user = await this.usersService.findByEmailWithPassword(me.email);

     if (!user) throw new UnauthorizedException('User not found');

    const ok = await compareHash(dto.currentPassword, user.password);

     if (!ok) throw new UnauthorizedException('Current password is incorrect');

     const hashedPassword = await hashValue(dto.newPassword);

     await this.usersService.updatePassword(userId, await hashValue(dto.newPassword));

      await this.usersService.updateRefreshTokenHash(userId, null);


  }

  private async getTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
        expiresIn: this.configService.getOrThrow<StringValue>('jwt.accessExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: this.configService.getOrThrow<StringValue>('jwt.refreshExpiresIn'),
      }),
    ]);
    return { accessToken, refreshToken };
  }

  private async updateRefreshTokenHash(userId: string, token: string | null) {
    const hash = token ? await hashValue(token) : null;
    await this.usersService.updateRefreshTokenHash(userId, hash);
  }
}