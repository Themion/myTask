import { Test } from '@nestjs/testing';
import { CacheService } from '~/modules/cache/cache.service';
import mockConfigModule from './config.module';

const mockCacheModule = async () =>
  Test.createTestingModule({
    imports: [await mockConfigModule()],
    providers: [CacheService],
    exports: [CacheService],
  }).compile();

export default mockCacheModule;
