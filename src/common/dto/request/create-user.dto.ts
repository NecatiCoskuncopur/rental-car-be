import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

import { IsAdult } from '../../validations/is-adult.validation';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'John' })
  @IsNotEmpty()
  @Length(3, 30, {
    message: 'Name must be between 3 and 30 characters long.',
  })
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/, {
    message: 'Name can only contain letters and spaces.',
  })
  name: string;

  @ApiProperty({ description: 'User surname', example: 'Doe' })
  @IsNotEmpty()
  @Length(3, 30, {
    message: 'Surname must be between 3 and 30 characters long.',
  })
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü\s]+$/, {
    message: 'Surname can only contain letters and spaces.',
  })
  surname: string;

  @ApiProperty({ description: 'User date of birth', example: '1990-09-11' })
  @IsNotEmpty()
  @IsAdult()
  dateOfBirth: string;

  @ApiProperty({ description: 'User email', example: 'johndoe@mail.com' })
  @IsEmail({}, { message: 'Email must be in a valid format' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'P@ssw0rd123',
    minLength: 8,
    maxLength: 64,
  })
  @IsNotEmpty()
  @Length(8, 64, {
    message: 'Password must be between 8 and 64 characters long.',
  })
  password: string;
}
