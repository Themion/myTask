import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AppController } from '~/app.controller';
import { AppService } from '~/app.service';
import { DatabaseModule } from '~/database/database.module';
import { validate } from '~/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: resolve(process.cwd(), '..', '..', '.env'),
      expandVariables: true,
      validate,
    }),
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
