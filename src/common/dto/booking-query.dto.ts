import { IsOptional, IsIn } from 'class-validator';
import { PaginateQueryDto } from 'src/common/dto/paginate-query.dto';

export class BookingQueryDto extends PaginateQueryDto {
  @IsOptional()
  @IsIn(['pending', 'confirmed', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'cancelled';
}
