import { Global, Module } from '@nestjs/common';
import { DatabaseProvider } from '~/modules/database/database.provider';
import { DatabaseService } from '~/modules/database/database.service';

@Global()
@Module({
  providers: [DatabaseProvider, DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
