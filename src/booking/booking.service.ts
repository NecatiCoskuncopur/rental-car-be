import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, Types } from 'mongoose';
import { BookingDocument } from './booking.model';

import { BookingQueryDto } from 'src/common/dto/booking-query.dto';
import { CreateBookingDto } from 'src/common/dto/create-booking.dto';
import { VehicleDocument } from 'src/vehicle/vehicle.model';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: PaginateModel<BookingDocument>,
    @InjectModel('Vehicle')
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async getAllBookings(query: BookingQueryDto) {
    const { page = 1, limit = 10, order = 'desc', status } = query;

    const queryConditions = {} as Record<string, any>;

    if (status) {
      queryConditions.status = status;
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { updatedAt: order === 'asc' ? 1 : -1 },
      populate: ['vehicle', 'user'],
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

  async createBooking(createBookingDto: CreateBookingDto, userId: string) {
    const { vehicleId, startDate, endDate } = createBookingDto;

    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (end <= start) {
      throw new BadRequestException('End date must be later than start date');
    }

    const overlappingBookings = await this.bookingModel.find({
      vehicle: vehicleId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      throw new BadRequestException(
        'The vehicle is already booked for the selected dates.',
      );
    }

    const dayDifference = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
    );
    const totalPrice = vehicle.price * dayDifference;

    const booking = new this.bookingModel({
      user: userId,
      vehicle: vehicleId,
      startDate,
      endDate,
      totalPrice,
      status: 'pending',
    });

    return booking.save().then((b) => b.populate(['user', 'vehicle']));
  }

  async updateBooking(
    bookingId: string,
    status: 'confirmed' | 'cancelled',
    userId: string,
    isAdmin: boolean,
  ) {
    const validStatuses = ['confirmed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid status value.');
    }

    const booking = await this.bookingModel.findById(bookingId);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    let isOwner = false;

    if (booking.user instanceof Types.ObjectId) {
      isOwner = booking.user.toString() === userId;
    } else if (typeof booking.user === 'object' && '_id' in booking.user) {
      isOwner =
        (booking.user as { _id: Types.ObjectId })._id.toString() === userId;
    }
    const isBookingPast = new Date(booking.startDate) <= new Date();

    if (isBookingPast) {
      throw new ForbiddenException(
        'You cannot update a booking that has already started or is in the past.',
      );
    }

    if (isAdmin) {
      return this.bookingModel.findByIdAndUpdate(
        bookingId,
        { $set: { status } },
        { new: true },
      );
    }

    if (isOwner && status === 'cancelled') {
      return this.bookingModel.findByIdAndUpdate(
        bookingId,
        { $set: { status: 'cancelled' } },
        { new: true },
      );
    }

    throw new ForbiddenException('You are not allowed to update this booking');
  }
}
