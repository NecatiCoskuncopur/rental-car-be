import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { NewUserRange } from 'src/common/enums/new-user-range.enum';

@Exclude()
export class NewUserCountResponseDto {
  @Expose()
  @ApiProperty()
  range: NewUserRange;

  @Expose()
  @ApiProperty()
  from: Date;

  @Expose()
  @ApiProperty()
  to: Date;

  @Expose()
  @ApiProperty()
  newUsers: number;
}
