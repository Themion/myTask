import { Module } from '@nestjs/common';
import { DatabaseProvider } from '~/modules/database/database.provider';
import { DatabaseService } from '~/modules/database/database.service';

@Module({
  providers: [DatabaseProvider, DatabaseService],
})
export class DatabaseModule {}
