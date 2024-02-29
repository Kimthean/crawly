import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTPResponse');

  use(request: Request, response: Response, next: NextFunction): void {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = request;

    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;

      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;

      const stringFormat = `"${method} ${originalUrl} ${statusCode} ${responseTime.toFixed(2)}ms" - ${userAgent} ${ip}`;

      if (statusCode >= 500) {
        this.logger.error(stringFormat);
      } else if (statusCode >= 400) {
        this.logger.warn(stringFormat);
      } else {
        this.logger.log(stringFormat);
      }
    });

    next();
  }
}
