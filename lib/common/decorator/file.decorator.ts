import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  applyDecorators,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const ApiFile = (type: 'single' | 'multi') => {
  let properties = {};

  if (type === 'single') {
    properties = {
      file: {
        type: 'string',
        format: 'binary',
      },
    };
  } else {
    properties = {
      files: {
        type: 'array',
        items: {
          type: 'string',
          format: 'binary',
        },
      },
    };
  }

  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties,
      },
    }),
  );
};

export const ValidateFilePipe = () =>
  new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
      new FileTypeValidator({
        fileType: /(image\/.*)|(application\/pdf)\/txt\/csv\/xlss/,
      }),
    ],
  });
