import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Matches } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({ description: 'Post title' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü0-9\s]+$/, {
    message: 'Title can only contain letters, numbers and spaces.',
  })
  title?: string;

  @ApiPropertyOptional({ description: 'Post content' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü0-9\s<>/="'-]*$/, {
    message:
      'Content can only contain letters, numbers, spaces and basic HTML tags.',
  })
  content?: string;

  @ApiPropertyOptional({
    description: 'Post image url',
    example: 'https://firebasestorage.googleapis.com/exampleImage.jpg',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image?: string;
}
