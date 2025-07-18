import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserService } from './user.service';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { UpdateUserDto } from 'src/common/dto/update-user.dto';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AdminGuard)
  @Get('getUsers')
  getUsers(@Query() query: PaginateQueryDto) {
    return this.userService.getUsers(query);
  }

  @Patch('updateUser/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @UseGuards(AdminGuard)
  @Delete('deleteUser/:id')
  deleteUser() {}
}
