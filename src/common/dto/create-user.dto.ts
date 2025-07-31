import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User name', example: 'John' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User surname', example: 'Doe' })
  @IsNotEmpty()
  surname: string;

  @ApiProperty({ description: 'User date of birth', example: '11.09.1990' })
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    description: 'User email',
    example: 'johndoe@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'P@ssw0rd123',
    minLength: 8,
    maxLength: 64,
  })
  @Length(8, 64, {
    message: 'Password must be between 8 and 64 characters long.',
  })
  password: string;
}
