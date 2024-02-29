import { ApiProperty } from '@nestjs/swagger';

import { IsUrl } from 'class-validator';

export class CrawlDto {
  @ApiProperty()
  @IsUrl({}, { each: true })
  url: string;
}

export class FetchDto {
  @ApiProperty()
  @IsUrl()
  url: string;
}
