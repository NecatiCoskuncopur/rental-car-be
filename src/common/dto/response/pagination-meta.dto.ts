import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaginationMetaDto {
  @Expose()
  @ApiProperty({ example: 10 })
  perPage: number;

  @Expose()
  @ApiProperty({ example: 1 })
  totalPages: number;

  @Expose()
  @ApiProperty({ example: 1 })
  currentPage: number;

  @Expose()
  @ApiProperty({ example: 1 })
  pageStartIndex: number;

  @Expose()
  @ApiProperty({ example: false })
  hasPrev: boolean;

  @Expose()
  @ApiProperty({ example: false })
  hasNext: boolean;

  @Expose()
  @ApiProperty({ example: null, nullable: true })
  prev: number | null;

  @Expose()
  @ApiProperty({ example: null, nullable: true })
  next: number | null;
}
