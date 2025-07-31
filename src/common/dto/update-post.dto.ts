import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({ description: 'Post title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Post content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'Post image url',
    example: 'https://firebasestorage.googleapis.com/exampleImage.jpg',
  })
  @IsOptional()
  @IsUrl()
  image?: string;
}
