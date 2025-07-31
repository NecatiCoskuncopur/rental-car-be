import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { Request } from 'express';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { UpdateUserDto } from 'src/common/dto/update-user.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from './user.service';

@ApiExtraModels(PaginateQueryDto)
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiRoles('admin')
  @UseGuards(AdminGuard)
  @Get('getUsers')
  getUsers(@Query() query: PaginateQueryDto) {
    return this.userService.getUsers(query);
  }

  @ApiRoles('user')
  @Get('getUser/bookings')
  async getUserBookings(@Req() req: Request, @Query() query: PaginateQueryDto) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }

    return this.userService.getUserBookings(userId, query);
  }

  @ApiRoles('user')
  @Patch('updateUser/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(userId, body);
  }

  @ApiRoles('user', 'admin')
  @Delete('deleteUser/:userId')
  deleteUser(@Param('userId') id: string, @Req() req: Request) {
    const userId = req.user?.sub;
    const isAdmin = Boolean(req.user?.isAdmin);
    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }

    return this.userService.deleteUser(id, userId, isAdmin);
  }
}
