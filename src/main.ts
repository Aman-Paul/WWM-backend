import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './exceptions/validation-exception.filter';
import { GlobalExceptionFilter } from './exceptions/global-exception-filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true
  }));
  // Apply the global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(9090);
}
bootstrap();
