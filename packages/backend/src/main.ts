import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/modules/app.module';
import { Env } from '~/types';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { HOST, BE_PORT, FE_PORT } = getConfig(app);

  const corsOptions = { origin: `http://${HOST}:${FE_PORT}` };
  app.enableCors(corsOptions);

  await app.listen(BE_PORT);
}

function getConfig(app: INestApplication) {
  const configService = app.get(ConfigService<Env>);
  return configService.getOrThrow<Env['NETWORK']>('NETWORK');
}

bootstrap();
