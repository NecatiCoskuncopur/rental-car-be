import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { PaginationMetaDto } from './pagination-meta.dto';
import { UserResponseDto } from './user-response.dto';

export class UsersResponseDataDto {
  @ApiProperty({ type: [UserResponseDto] })
  @Type(() => UserResponseDto)
  users: UserResponseDto[];

  @ApiProperty()
  @Type(() => PaginationMetaDto)
  pagination: PaginationMetaDto;

  @ApiProperty({ example: 100 })
  totalUsers: number;
}
