import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { LoginDto } from 'src/common/dto/login.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiRoles('guest')
  @Post('register')
  async register(@Body() createUser: CreateUserDto): Promise<string> {
    return this.authService.register(createUser);
  }

  @ApiRoles('guest')
  @Post('login')
  async login(
    @Body() login: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    return this.authService.login(login, res);
  }

  @ApiRoles('guest')
  @Get('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
