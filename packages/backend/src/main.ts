import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(getPortFromConfig(app));
}

function getPortFromConfig(app: INestApplication) {
  const config = app.get(ConfigService);
  return parseInt(config.getOrThrow('BE_PORT'));
}

bootstrap();
