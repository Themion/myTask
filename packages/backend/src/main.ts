import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '~/app.module';
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
  const HOST = configService.getOrThrow<Env['HOST']>('HOST');
  const BE_PORT = configService.getOrThrow<Env['BE_PORT']>('BE_PORT');
  const FE_PORT = configService.getOrThrow<Env['FE_PORT']>('FE_PORT');

  return { HOST, BE_PORT, FE_PORT };
}

bootstrap();
