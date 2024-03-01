import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsUrl } from 'class-validator';

export class CrawlDto {
  @ApiProperty()
  @IsUrl({}, { each: true })
  url: string;
}

export class CrawlArrayDto {
  @ApiProperty()
  @IsString({ each: true })
  url: string[];
}
