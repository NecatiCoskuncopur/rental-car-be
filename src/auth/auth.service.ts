import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { Response } from 'express';
import { PaginateModel } from 'mongoose';

import { CreateUserDto } from 'src/common/dto/create-user.dto';
import { LoginDto } from 'src/common/dto/login.dto';
import { UserDocument } from 'src/user/user.model';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User')
    private readonly userModel: PaginateModel<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUser: CreateUserDto): Promise<string> {
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
      return 'Registration Successful';
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Registration failed');
    }
  }

  async login(login: LoginDto, res: Response): Promise<any> {
    try {
      const { email, password } = login;

      const user = await this.userModel.findOne({ email }).select('+password');
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
        sameSite: 'none',
        path: '/',
      });

      const { password: _, ...userWithoutPassword } = user.toObject();

      return userWithoutPassword;
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Login failed');
    }
  }

  logout(res: Response): void {
    try {
      res.clearCookie('access_token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });
      res.status(200).json({ message: 'User has been signed out' });
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('Logout failed');
    }
  }

  async getUserById(userId: string) {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
