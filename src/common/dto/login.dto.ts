import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User email',
    example: 'johndoe@mail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'P@ssw0rd123',
  })
  @IsNotEmpty()
  password: string;
}
