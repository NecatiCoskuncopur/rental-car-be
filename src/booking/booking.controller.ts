import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { BookingQueryDto } from 'src/common/dto/request/booking-query.dto';
import { CreateBookingDto } from 'src/common/dto/request/create-booking.dto';
import { UpdateBookingStatusDto } from 'src/common/dto/request/update-booking.dto';
import { BookingResponseDto } from 'src/common/dto/response/booking-response.dto';
import { BookingsResponseDto } from 'src/common/dto/response/bookings-response.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Get('getBookings')
  async getBookings(
    @Query() query: BookingQueryDto,
  ): Promise<BookingsResponseDto> {
    return this.bookingService.getBookings(query);
  }

  @ApiRoles('user')
  @UseGuards(AuthGuard)
  @Post('createBooking')
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<BookingResponseDto> {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException('User id not found');

    const savedBooking = await this.bookingService.createBooking(
      createBookingDto,
      userId,
    );

    res.cookie('bookingSuccessAllowed', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 1,
      sameSite: 'lax',
      path: '/',
      domain: '.necaticoskuncopur.com'
    });

    return savedBooking;
  }

  @ApiRoles('user', 'admin')
  @UseGuards(AuthGuard)
  @Patch('updateBooking/:bookingId')
  async updateBooking(
    @Param('bookingId') bookingId: string,
    @Body() updateDto: UpdateBookingStatusDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.sub;
    const isAdmin = req.user?.isAdmin;
    if (!userId) throw new UnauthorizedException('User ID not found');

    if (typeof isAdmin !== 'boolean')
      throw new UnauthorizedException('Admin status is missing');

    return this.bookingService.updateBooking(
      bookingId,
      updateDto.status,
      userId,
      isAdmin,
    );
  }
}
