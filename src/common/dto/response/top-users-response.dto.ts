import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { TopUserResponseDto } from './top-user-response.dto';

export class TopUsersResponseDto {
  @ApiProperty({
    description: 'Top user list.',
    type: [TopUserResponseDto],
  })
  @Type(() => TopUserResponseDto)
  income: TopUserResponseDto[];
}
