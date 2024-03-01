import { Controller, Post, Body } from '@nestjs/common';
import { CrawlService } from './crawl.service';
import { CrawlArrayDto, CrawlDto } from './dto/create-crawl.dto';

@Controller('crawl')
export class CrawlController {
  constructor(private readonly crawlService: CrawlService) {}

  @Post()
  async crawl(@Body() crawlDto: CrawlDto) {
    return this.crawlService.crawl(crawlDto);
  }

  @Post('array')
  async crawlArray(@Body() crawlDto: CrawlArrayDto) {
    return this.crawlService.crawlMultiple(crawlDto);
  }
}
