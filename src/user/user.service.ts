import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PaginateModel } from 'mongoose';
import { UserDocument } from './user.model';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { UpdateUserDto } from 'src/common/dto/update-user.dto';
import { pickAllowedKeys } from 'src/common/utils/object.util';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: PaginateModel<UserDocument>,
  ) {}

  async getUsers(query: PaginateQueryDto) {
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

    return await this.userModel.paginate(queryConditions, options);
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    const allowedUpdates = [
      'name',
      'surname',
      'dateOfBirth',
      'email',
      'password',
    ];
    const updates = pickAllowedKeys(data, allowedUpdates);

    if (data.password) {
      if (!data.oldPassword) {
        throw new BadRequestException(
          'Old password is required to change password',
        );
      }
      const user = await this.userModel.findById(userId).select('+password');

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isMatch = await bcryptjs.compare(data.oldPassword, user.password);
      if (!isMatch) {
        throw new ForbiddenException('Old password is incorrect');
      }

      if (data.password.length < 8 || data.password.length > 64) {
        throw new BadRequestException(
          'Password must be between 8 and 64 characters long.',
        );
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

    return updatedUser;
  }

  // Hard Delete - soft delete
}
