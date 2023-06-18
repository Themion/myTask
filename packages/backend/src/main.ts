import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
import { Env } from './types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(getPortFromConfig(app));
}

function getPortFromConfig(app: INestApplication) {
  const config = app.get(ConfigService<Env>);
  return config.getOrThrow<Env['BE_PORT']>('BE_PORT');
}

bootstrap();
