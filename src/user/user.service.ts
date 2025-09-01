import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { PaginateModel } from 'mongoose';

import { PaginateQueryDto } from 'src/common/dto/request/paginate-query.dto';
import { UpdateUserDto } from 'src/common/dto/request/user-update.dto';
import { DeleteUserResponseDto } from 'src/common/dto/response/delete-user-response.dto';
import { UserResponseDto } from 'src/common/dto/response/user-response.dto';
import { UsersResponseDataDto } from 'src/common/dto/response/users-response.dto';
import { pickAllowedKeys } from 'src/common/utils/pickAllowedKeys.util';
import { UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: PaginateModel<UserDocument>,
  ) {}

  async getUsers(query: PaginateQueryDto): Promise<UsersResponseDataDto> {
    const { page = 1, limit = 10, order = 'desc' } = query;

    const queryConditions = {};

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { updatedAt: order === 'asc' ? 1 : -1 },
      lean: true,
      customLabels: {
        totalDocs: 'totalUsers',
        docs: 'users',
        limit: 'perPage',
        page: 'currentPage',
        totalPages: 'totalPages',
        nextPage: 'next',
        prevPage: 'prev',
        pagingCounter: 'pageStartIndex',
        hasPrevPage: 'hasPrev',
        hasNextPage: 'hasNext',
      },
    };

    const result = await this.userModel.paginate(queryConditions, options);

    const usersDto = plainToInstance(UsersResponseDataDto, {
      users: result.users,
      pagination: {
        perPage: result.perPage,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        pageStartIndex: result.pageStartIndex,
        hasPrev: result.hasPrev,
        hasNext: result.hasNext,
        prev: result.prev,
        next: result.next,
      },
      totalUsers: result.totalUsers,
    });

    return usersDto;
  }

  async updateUser(
    requesterId: string,
    userId: string,
    data: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (requesterId !== userId) {
      throw new ForbiddenException('You can only update your own account');
    }

    const allowedUpdates = [
      'name',
      'surname',
      'dateOfBirth',
      'email',
      'password',
    ];
    const updates = pickAllowedKeys(data, allowedUpdates);

    const user = await this.userModel.findById(userId).select('+password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.password) {
      if (!data.oldPassword) {
        throw new BadRequestException(
          'Old password is required to change password',
        );
      }
      const isMatch = await bcryptjs.compare(data.oldPassword, user.password);
      if (!isMatch) {
        throw new ForbiddenException('Old password is incorrect');
      }

      updates.password = await bcryptjs.hash(data.password, 10);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true, context: 'query' },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDto, updatedUser);
  }

  async deleteUser(
    requesterId: string,
    userId: string,
    isAdmin: boolean,
  ): Promise<DeleteUserResponseDto> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (String(requesterId) !== String(userId) && !isAdmin) {
      throw new ForbiddenException('You are not allowed to delete this user');
    }

    await this.userModel.findByIdAndDelete(userId);
    return { message: 'The user has been deleted' };
  }
}
