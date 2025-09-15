import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { PaginateQueryDto } from 'src/common/dto/request/paginate-query.dto';
import { UpdateUserDto } from 'src/common/dto/request/user-update.dto';
import { DeleteResponseDto } from 'src/common/dto/response/delete-response.dto';
import { UserBookingsResponseDto } from 'src/common/dto/response/user-bookings-response.dto';
import { UserResponseDto } from 'src/common/dto/response/user-response.dto';
import { UsersResponseDataDto } from 'src/common/dto/response/users-response.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiRoles('admin')
  @UseGuards(AdminGuard)
  @Get('getUsers')
  @ApiOkResponse({
    type: UsersResponseDataDto,
    description: 'Paginated list of users',
  })
  async getUsers(
    @Query() query: PaginateQueryDto,
  ): Promise<UsersResponseDataDto> {
    return this.userService.getUsers(query);
  }

  @ApiRoles('user')
  @Get('getUserBookings')
  getUserBookings(
    @Query() query: PaginateQueryDto,
    @Req() req: Request,
  ): Promise<UserBookingsResponseDto> {
    const id = req.user?.sub;
    return this.userService.getUserBookings(query, id!);
  }

  @ApiRoles('user')
  @Patch('updateUser/:userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() body: UpdateUserDto,
    @Req() req: Request,
  ): Promise<UserResponseDto> {
    const id = req.user?.sub;
    return this.userService.updateUser(id!, userId, body);
  }

  @ApiRoles('user', 'admin')
  @Delete('deleteUser/:userId')
  deleteUser(
    @Param('userId') userId: string,
    @Req() req: Request,
  ): Promise<DeleteResponseDto> {
    const id = req.user?.sub;
    const isAdmin = Boolean(req.user?.isAdmin);

    return this.userService.deleteUser(id!, userId, isAdmin);
  }
}
