import { Controller, Post, Body } from '@nestjs/common';
import { CrawlService } from './crawl.service';
import { CrawlDto } from './dto/create-crawl.dto';

@Controller('crawl')
export class CrawlController {
  constructor(private readonly crawlService: CrawlService) {}

  @Post()
  async crawl(@Body() crawlDto: CrawlDto) {
    return this.crawlService.crawl(crawlDto);
  }
}
