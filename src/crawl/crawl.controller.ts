import { Controller, Post, Body } from '@nestjs/common';
import { CrawlService } from './crawl.service';
import { Crawl, CrawlDto } from './dto/create-crawl.dto';

@Controller('crawl')
export class CrawlController {
  constructor(private readonly crawlService: CrawlService) {}

  @Post()
  async crawlArray(@Body() crawlDto: Crawl) {
    return this.crawlService.crawl(crawlDto);
  }

  @Post('get-urls')
  async getUrls(@Body() crawlDto: CrawlDto) {
    return this.crawlService.CrawlLinks(crawlDto);
  }
}
