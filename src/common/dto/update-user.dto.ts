import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User name', example: 'John' })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiPropertyOptional({ description: 'User surname', example: 'Doe' })
  @IsOptional()
  @IsString()
  surname?: string;

  @ApiPropertyOptional({
    description: 'User date of birth',
    example: '11.09.1990',
  })
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'johndoe@mail.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: 'User password',
    example: 'P@ssw0rd123',
    minLength: 8,
    maxLength: 64,
  })
  @IsOptional()
  @IsString()
  @Length(8, 64)
  password?: string;

  @ApiPropertyOptional({
    description: 'User old password',
    example: 'P@ssw0rd123',
  })
  @ApiPropertyOptional({ description: 'User name', example: 'John' })
  @IsOptional()
  @IsString()
  oldPassword?: string;
}
