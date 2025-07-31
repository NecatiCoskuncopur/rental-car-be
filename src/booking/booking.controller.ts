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
import { ApiExtraModels } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { ApiRoles } from 'src/common/decorators/api-role.decorator';
import { BookingQueryDto } from 'src/common/dto/booking-query.dto';
import { CreateBookingDto } from 'src/common/dto/create-booking.dto';
import { UpdateBookingStatusDto } from 'src/common/dto/update-booking.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { BookingService } from './booking.service';

@ApiExtraModels(BookingQueryDto)
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ApiRoles('admin')
  @UseGuards(AuthGuard, AdminGuard)
  @Get('getBookings')
  async getBookings(@Query() query: BookingQueryDto) {
    return this.bookingService.getAllBookings(query);
  }

  @ApiRoles('user')
  @UseGuards(AuthGuard)
  @Post('createBooking')
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
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
    if (!userId) {
      throw new UnauthorizedException('User ID not found');
    }

    if (typeof isAdmin !== 'boolean') {
      throw new UnauthorizedException('Admin status is missing');
    }

    return this.bookingService.updateBooking(
      bookingId,
      updateDto.status,
      userId,
      isAdmin,
    );
  }
}
