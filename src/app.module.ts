import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';

import { CrawlModule } from './crawl/crawl.module';
import { AppLoggerMiddleware } from 'lib/logger';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CrawlModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
