import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { PaginateModel } from 'mongoose';

import { CreateUserDto } from 'src/common/dto/request/create-user.dto';
import { LoginDto } from 'src/common/dto/request/login.dto';
import { RegisterResponseDto } from 'src/common/dto/response/register-response-dto';
import { UserResponseDto } from 'src/common/dto/response/user-response.dto';
import { UserDocument } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: PaginateModel<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUser: CreateUserDto): Promise<RegisterResponseDto> {
    const { name, surname, dateOfBirth, email, password } = createUser;

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new this.userModel({
      name,
      surname,
      dateOfBirth,
      email,
      password: hashedPassword,
    });

    try {
      await newUser.save();
      return { message: 'Registration Successful' };
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Registration failed');
    }
  }

  async login(login: LoginDto, res: Response): Promise<UserResponseDto> {
    const { email, password } = login;

    const user = await this.userModel
      .findOne({ email })
      .select('+password')
      .lean();

    if (!user || !bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = await this.jwtService.signAsync(payload);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      domain: '.necaticoskuncopur.com'
    });

    const { password: _, __v, ...userWithoutPassword } = user;

    return plainToInstance(UserResponseDto, {
      ...userWithoutPassword,
      _id: user._id,
    });
  }

  logout(res: Response): { message: string } {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      domain: '.necaticoskuncopur.com'
    });

    return { message: 'User has been signed out' };
  }

  async getUserById(userId: string): Promise<UserResponseDto> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return plainToInstance(UserResponseDto, user);
  }
}
