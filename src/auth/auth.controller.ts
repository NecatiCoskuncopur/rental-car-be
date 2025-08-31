import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { CreateUserDto } from 'src/common/dto/request/create-user.dto';
import { LoginDto } from 'src/common/dto/request/login.dto';
import { LogoutResponseDto } from 'src/common/dto/response/logout-response.dto';
import { RegisterResponseDto } from 'src/common/dto/response/register-response-dto';
import { UserResponseDto } from 'src/common/dto/response/user-response.dto';
import { AuthGuard, JwtPayload } from 'src/common/guards/auth.guard';
import { AuthService } from './auth.service';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiRoles('guest')
  @Post('register')
  async register(
    @Body() createUser: CreateUserDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(createUser);
  }

  @ApiRoles('guest')
  @Post('login')
  async login(
    @Body() login: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<UserResponseDto> {
    return this.authService.login(login, res);
  }

  @UseGuards(AuthGuard)
  @ApiRoles('user')
  @Get('logout')
  @ApiOkResponse({ type: LogoutResponseDto })
  logout(@Res({ passthrough: true }) res: Response): LogoutResponseDto {
    return this.authService.logout(res);
  }

  @UseGuards(AuthGuard)
  @ApiRoles('user')
  @Get('me')
  async getProfile(@Req() req: RequestWithUser): Promise<UserResponseDto> {
    const userId = req.user?.sub;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    return this.authService.getUserById(userId);
  }
}
