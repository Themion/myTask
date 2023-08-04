import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule, Routes } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { envPaths } from '~/constants';
import { validate } from '~/env';
import { Env } from '~/types';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SignInModule } from './auth/signin/signin.module';
import { SignUpModule } from './auth/signup/signup.module';
import { CacheModule } from './cache/cache.module';
import { DatabaseModule } from './database/database.module';
import { EmailModule } from './email/email.module';
import { GroupModule } from './group/group.module';

// sign up / sign in / sign out
const router: Routes = [
  {
    path: 'auth',
    module: AuthModule,
    children: [
      {
        path: 'signup',
        module: SignUpModule,
      },
      {
        path: 'signin',
        module: SignInModule,
      },
    ],
  },
];

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
    SignUpModule,
    SignInModule,
    RouterModule.register(router),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
