import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { envPaths } from '~/constants';
import { validate } from '~/env';
import { Env } from '~/types';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: envPaths,
      expandVariables: true,
      validate,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Env>) => ({
        ...configService.getOrThrow<Env['JWT']>('JWT'),
      }),
    }),
    DatabaseModule,
    EmailModule,
    GroupModule,
    AuthModule,
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
