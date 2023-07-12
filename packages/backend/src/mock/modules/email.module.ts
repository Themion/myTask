import { Test } from '@nestjs/testing';
import { EmailService } from '~/modules/email/email.service';
import mockConfigModule from './config.module';

const mockEmailModule = async () =>
  Test.createTestingModule({
    imports: [await mockConfigModule()],
    providers: [EmailService],
  }).compile();

export default mockEmailModule;
