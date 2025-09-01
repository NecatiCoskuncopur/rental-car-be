import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UploadResponseDto {
  @Expose()
  @ApiProperty()
  url: string;

  @Expose()
  @ApiProperty()
  secure_url: string;

  @Expose()
  @ApiProperty()
  public_id: string;
}
