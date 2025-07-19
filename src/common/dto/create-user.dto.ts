import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  dateOfBirth: string;

  @IsEmail()
  email: string;

  @Length(8, 64, {
    message: 'Password must be between 8 and 64 characters long.',
  })
  password: string;
}
