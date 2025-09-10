import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TopUserResponseDto {
  @Expose()
  @ApiProperty()
  userId: string;

  @Expose()
  @ApiProperty()
  bookingCount: number;

  @Expose()
  @ApiProperty()
  fullName: string;
}
