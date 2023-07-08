import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(() => process.env)],
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendTestEmail', () => {
    it('should work', async () => {
      const target = process.env.EMAIL_TEST_ADDRESS as string;
      await expect(service.sendTestEmail(target)).resolves.not.toThrow();
    });

    it('should throw with invalid email address', async () => {
      const target = 'invalid@email';
      await expect(async () => await service.sendTestEmail(target)).rejects.toThrow();
    });
  });
});
