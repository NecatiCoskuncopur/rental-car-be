import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, Matches } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Post title' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü0-9\s]+$/, {
    message: 'Title can only contain letters, numbers and spaces.',
  })
  title: string;

  @ApiProperty({ description: 'Post content' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-zÇçĞğİıÖöŞşÜü0-9\s]+$/, {
    message: 'Content can only contain letters, numbers and spaces.',
  })
  content: string;

  @ApiProperty({
    description: 'Post image url',
    example: 'https://firebasestorage.googleapis.com/exampleImage.jpg',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image: string;
}
