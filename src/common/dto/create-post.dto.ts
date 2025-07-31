import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Post content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Post image url',
    example: 'https://firebasestorage.googleapis.com/exampleImage.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}
