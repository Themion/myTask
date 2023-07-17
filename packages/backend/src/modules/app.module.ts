import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule, Routes } from '@nestjs/core';
import { envPaths } from '~/constants';
import { validate } from '~/env';
import { AppController } from '~/modules/app.controller';
import { AppService } from '~/modules/app.service';
import { SignupModule } from '~/modules/auth/signup/signup.module';
import { DatabaseModule } from '~/modules/database/database.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { GroupModule } from './group/group.module';

const router: Routes = [
  {
    path: 'auth',
    module: AuthModule,
    children: [
      {
        path: 'signup',
        module: SignupModule,
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
    DatabaseModule,
    EmailModule,
    GroupModule,
    AuthModule,
    SignupModule,
    RouterModule.register(router),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
