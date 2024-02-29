import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    snapshot: true,
    logger: ['log', 'error', 'warn', 'debug', 'verbose', 'fatal'],
  });
  app.setGlobalPrefix('api');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const logger = new Logger('Factory');

  const config = new DocumentBuilder()
    .setTitle('Crawlly documentation')
    .setDescription('')
    .setVersion('1.0')
    .addOAuth2()
    .addBearerAuth()

    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000, () => {
    logger.log('Server start at http://localhost:3000');
    logger.log('Swagger start at http://localhost:3000/doc');
  });
}
bootstrap();
