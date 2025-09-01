import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

import { IsAdult } from 'src/common/validations/is-adult.validation';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User name', example: 'John' })
  @IsOptional()
  @IsString()
  @Length(3, 30, {
    message: 'Name must be between 3 and 30 characters long.',
  })
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/, {
    message: 'Name can only contain letters and spaces.',
  })
  name?: string;

  @ApiPropertyOptional({ description: 'User surname', example: 'Doe' })
  @IsOptional()
  @IsString()
  @Length(3, 30, {
    message: 'Surname must be between 3 and 30 characters long.',
  })
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/, {
    message: 'Surname can only contain letters and spaces.',
  })
  surname?: string;

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: '11.09.1990',
  })
  @IsOptional()
  @IsAdult()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'johndoe@mail.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be in a valid format' })
  email?: string;

  @ApiPropertyOptional({
    description: 'User password',
    example: 'P@ssw0rd123',
    minLength: 8,
    maxLength: 64,
  })
  @IsOptional()
  @IsString()
  @Length(8, 64, {
    message: 'Password must be between 8 and 64 characters long.',
  })
  password?: string;

  @ApiPropertyOptional({
    description: 'User old password',
    example: 'P@ssw0rd123',
  })
  @IsOptional()
  @IsString()
  oldPassword?: string;
}
