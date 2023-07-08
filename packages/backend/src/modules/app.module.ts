import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envPaths } from '~/constants';
import { validate } from '~/env';
import { AppController } from '~/modules/app.controller';
import { AppService } from '~/modules/app.service';
import { DatabaseModule } from '~/modules/database/database.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

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
    AuthModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
