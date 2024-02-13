import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as appConstants from '../config/appConstants.json';
import dbUrls  from '../config/db';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const environment = process.env.ENV || appConstants.ENV.DEVELOPMENT;
  process.env.DATABASE_URL = dbUrls[environment].url;
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  await app.listen(9898);
}
bootstrap();
