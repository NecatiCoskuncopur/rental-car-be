import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model, PaginateModel, Types } from 'mongoose';

import { BookingQueryDto } from 'src/common/dto/request/booking-query.dto';
import { CreateBookingDto } from 'src/common/dto/request/create-booking.dto';
import { BookingResponseDto } from 'src/common/dto/response/booking-response.dto';
import { BookingsResponseDto } from 'src/common/dto/response/bookings-response.dto';
import { Vehicle, VehicleDocument } from 'src/vehicle/vehicle.model';
import { Booking, BookingDocument } from './booking.model';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: PaginateModel<BookingDocument>,
    @InjectModel(Vehicle.name)
    private readonly vehicleModel: Model<VehicleDocument>,
  ) {}

  async getBookings(query: BookingQueryDto): Promise<BookingsResponseDto> {
    const { page = 1, limit = 10, order = 'desc', status } = query;

    const queryConditions = {} as Record<string, any>;

    if (status) {
      queryConditions.status = status;
    }

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: { updatedAt: order === 'asc' ? 1 : -1 },
      populate: ['vehicleId', 'userId'],
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

    const result = await this.bookingModel.paginate(queryConditions, options);

    const bookingDto = plainToInstance(BookingsResponseDto, {
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

    return bookingDto;
  }

  async createBooking(
    data: CreateBookingDto,
    userId: string,
  ): Promise<BookingResponseDto> {
    const { vehicleId, startDate, endDate } = data;

    const vehicle = await this.vehicleModel.findById(vehicleId);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const bookedPlates = await this.bookingModel
      .find({
        vehicleId,
        status: { $ne: 'cancelled' },
        $or: [
          { startDate: { $lt: end }, endDate: { $gt: start } },
          { startDate: { $gte: start }, endDate: { $lte: end } },
        ],
      })
      .distinct('plateNumber');

    const availablePlates = vehicle.plateNumbers.filter(
      (plate) => !bookedPlates.includes(plate),
    );

    if (availablePlates.length === 0) {
      throw new BadRequestException(
        'All vehicles of this model are booked for the specified dates.',
      );
    }

    const selectedPlate = availablePlates[0];

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(
      Math.abs((start.getTime() - end.getTime()) / oneDay),
    );
    const totalPrice = vehicle.price * diffDays;

    const newBooking = new this.bookingModel({
      userId,
      vehicleId,
      startDate: start,
      endDate: end,
      totalPrice,
      plateNumber: selectedPlate,
      status: 'pending',
    });

    const booking = await newBooking.save();
    return plainToInstance(BookingResponseDto, booking);
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

    const isOwner =
      booking.userId instanceof Types.ObjectId &&
      booking.userId.toString() === userId;

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
