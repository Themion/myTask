import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule, Routes } from '@nestjs/core';
import { envPaths } from '~/constants';
import { validate } from '~/env';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SignInModule } from './auth/signin/signin.module';
import { SignUpModule } from './auth/signup/signup.module';
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
    DatabaseModule,
    EmailModule,
    GroupModule,
    AuthModule,
    SignUpModule,
    SignInModule,
    RouterModule.register(router),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
