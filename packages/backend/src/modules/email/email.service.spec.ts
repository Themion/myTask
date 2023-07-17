import SMTPPool from 'nodemailer/lib/smtp-pool';
import { v4 as uuidv4 } from 'uuid';
import { mockEmailModule } from '~/mock';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  const receiver = process.env.EMAIL_TEST_RECEIVER as string;

  beforeEach(async () => {
    const module = await mockEmailModule();
    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should work', async () => {
      let result: SMTPPool.SentMessageInfo;
      expect(
        (result = await service.sendEmail(receiver, 'test', '<div>test123</div>')),
      ).toBeDefined();
      expect(result.accepted.length).toEqual(1);
      expect(result.rejected.length).toEqual(0);
    });

    describe('should throw error when', () => {
      it('empty receiver', async () => {
        await expect(
          async () => await service.sendEmail('', 'test', '<div>test123</div>'),
        ).rejects.toThrow();
      });
    });
  });

  describe('sendSignUpEmail', () => {
    it('should work', async () => {
      let result: SMTPPool.SentMessageInfo;
      expect((result = await service.sendSignUpEmail(receiver, uuidv4()))).toBeDefined();
      expect(result.accepted.length).toEqual(1);
      expect(result.rejected.length).toEqual(0);
    });
  });
});
