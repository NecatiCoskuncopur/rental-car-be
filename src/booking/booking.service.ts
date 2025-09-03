import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { PaginateModel, Types } from 'mongoose';

import { BookingQueryDto } from 'src/common/dto/request/bookings-query.dto';
import { CreateBookingDto } from 'src/common/dto/request/create-booking.dto';
import { BookingResponseDto } from 'src/common/dto/response/booking-response.dto';
import { BookingsResponseDto } from 'src/common/dto/response/bookings-response.dto';
import { VehicleDocument } from 'src/vehicle/vehicle.model';
import { BookingDocument } from './booking.model';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Booking')
    private readonly bookingModel: PaginateModel<BookingDocument>,
    @InjectModel('Vehicle')
    private readonly vehicleModel: PaginateModel<VehicleDocument>,
  ) {}

  async getAllBookings(query: BookingQueryDto): Promise<BookingsResponseDto> {
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

    const result = await this.bookingModel.paginate(queryConditions, options);

    const bookings = plainToInstance(BookingsResponseDto, {
      bookings: result.bookings,
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
      totalBookings: result.totalBookings,
    });

    return bookings;
  }

  async createBooking(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<BookingResponseDto> {
    const { templateId, startDate, endDate } = createBookingDto;

    const start = new Date(startDate + 'T00:00:00Z');
    const end = new Date(endDate + 'T23:59:59Z');

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (end <= start) {
      throw new BadRequestException('End date must be later than start date');
    }

    const bookedVehicleIds = await this.bookingModel
      .find({
        status: { $in: ['pending', 'confirmed'] },
        $or: [{ startDate: { $lte: end }, endDate: { $gte: start } }],
      })
      .distinct('vehicle');

    const availableVehicle = await this.vehicleModel
      .findOne({
        templateId,
        _id: { $nin: bookedVehicleIds },
      })
      .sort({ updatedAt: 1 });

    if (!availableVehicle) {
      throw new BadRequestException(
        'No available vehicles for the selected template and dates.',
      );
    }

    const dayDifference = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
    );
    const totalPrice = availableVehicle.price * dayDifference;

    const booking = new this.bookingModel({
      user: userId,
      vehicle: availableVehicle._id,
      startDate: start,
      endDate: end,
      totalPrice,
      status: 'pending',
    });

    const savedBooking = await booking.save();

    const populatedBooking = await savedBooking.populate(['user', 'vehicle']);

    return plainToInstance(BookingResponseDto, populatedBooking);
  }

  async updateBooking(
    bookingId: string,
    status: 'confirmed' | 'cancelled',
    userId: string,
    isAdmin: boolean,
  ): Promise<BookingResponseDto> {
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

    let newStatus: 'confirmed' | 'cancelled' = booking.status as
      | 'confirmed'
      | 'cancelled';

    if (isAdmin) {
      newStatus = status;
    } else if (isOwner && status === 'cancelled') {
      newStatus = 'cancelled';
    } else {
      throw new ForbiddenException(
        'You are not allowed to update this booking',
      );
    }

    const updatedBooking = await this.bookingModel.findByIdAndUpdate(
      bookingId,
      { $set: { status: newStatus } },
      { new: true },
    );

    if (newStatus === 'cancelled') {
      await this.vehicleModel.findByIdAndUpdate(booking.vehicle, {
        $set: { available: true },
      });
    }

    const populatedBooking = updatedBooking?.populate(['user', 'vehicle']);
    return plainToInstance(BookingResponseDto, populatedBooking);
  }
}
