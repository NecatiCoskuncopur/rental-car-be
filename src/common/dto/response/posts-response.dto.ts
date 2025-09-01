import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PaginationMetaDto } from './pagination-meta.dto';
import { PostResponseDto } from './post-response.dto';

export class PostsResponseDto {
  @ApiProperty({ type: [PostResponseDto] })
  @Type(() => PostResponseDto)
  posts: PostResponseDto[];

  @ApiProperty()
  @Type(() => PaginationMetaDto)
  pagination: PaginationMetaDto;

  @ApiProperty({ example: 100 })
  totalPosts: number;
}
