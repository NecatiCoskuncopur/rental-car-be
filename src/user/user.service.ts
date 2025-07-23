import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { PaginateModel } from 'mongoose';

import { BookingDocument } from 'src/booking/booking.model';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';
import { UpdateUserDto } from 'src/common/dto/update-user.dto';
import { pickAllowedKeys } from 'src/common/utils/object.util';
import { UserDocument } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: PaginateModel<UserDocument>,
    @InjectModel('Booking')
    private readonly bookingModel: PaginateModel<BookingDocument>,
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

  async getUserBookings(userId: string, query: PaginateQueryDto) {
    const { page = 1, limit = 10, order = 'desc' } = query;
    const queryConditions = { user: userId };

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { updatedAt: order === 'asc' ? 1 : -1 },
      populate: ['vehicle'],
      lean: true,
      customLabels: {
        totalDocs: 'totalBookings',
        docs: 'bookings',
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

    return this.bookingModel.paginate(queryConditions, options);
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

  async deleteUser(id: string, userId: string, isAdmin: boolean) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (String(id) !== String(userId) && !isAdmin) {
      throw new ForbiddenException('You are not allowed to delete this user');
    }

    await this.userModel.findByIdAndDelete(id);
    return { message: 'The user has been deleted' };
  }
}
