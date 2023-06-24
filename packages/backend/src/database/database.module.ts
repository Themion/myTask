import { Module } from '@nestjs/common';
import { DatabaseProvider } from './database.provider';
import { DatabaseService } from './database.service';

@Module({
  providers: [DatabaseProvider, DatabaseService],
})
export class DatabaseModule {}
