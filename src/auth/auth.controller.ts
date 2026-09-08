import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { Public } from '../common/decorator/public.decorator.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { JwtRefreshGuard } from './jwt.refresh.gaurd.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() 
  @Post('register')
  register(@Body() dto: RegisterDto) { 
    return this.authService.register(dto);

   }

  @Public() 
  @Post('login') 
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginDto) { 
    return this.authService.login(dto);
   }

  @Public() 
  @UseGuards(JwtRefreshGuard) 
  @ApiBearerAuth() @Post('refresh') 
  @HttpCode(HttpStatus.OK)
  refresh(@CurrentUser('id') userId: string, 
  @CurrentUser('refreshToken') rt: string) {
    return this.authService.refreshTokens(userId, rt);
  }

  @ApiBearerAuth() 
  @Post('logout') 
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser('id') 
  userId: string) {
    return this.authService.logout(userId).then(() => 
      ({ message: 'Logged out successfully', data: null })
  );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password') 
  @HttpCode(HttpStatus.OK)
  changePassword(
    @CurrentUser('id') 
    userId: string, 
  @Body() dto: ChangePasswordDto) {
  console.log('🔥🔥🔥 CHANGE PASSWORD CONTROLLER WAS REACHED 🔥🔥🔥');
  console.log('USER ID:', userId);
  console.log('DTO:', dto);


    return this.authService.changePassword(userId, dto).then(() => 
      ({ message: 'Password changed', 
        data: null 
      }));
  }
}
