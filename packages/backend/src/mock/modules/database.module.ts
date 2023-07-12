import { Test } from '@nestjs/testing';
import { DatabaseProvider } from '~/modules/database/database.provider';
import { DatabaseService } from '~/modules/database/database.service';
import mockConfigModule from './config.module';

const mockDatabaseModule = async () =>
  Test.createTestingModule({
    imports: [await mockConfigModule()],
    providers: [DatabaseService, DatabaseProvider],
  }).compile();

export default mockDatabaseModule;
