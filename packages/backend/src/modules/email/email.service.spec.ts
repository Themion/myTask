import { mockEmailModule } from '~/mock';
import { EmailService } from './email.service';

const sendMailMock = jest.fn((mailOption, callback) =>
  callback(mailOption.to === '' ? new Error('test') : undefined, { accepted: [1], rejected: [] }),
);
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: sendMailMock,
  })),
}));

describe('EmailService', () => {
  let service: EmailService;
  const receiver = process.env.EMAIL_TEST_RECEIVER as string;

  beforeEach(async () => {
    jest.resetModules();
    const module = await mockEmailModule();
    service = module.get<EmailService>(EmailService);
  });

  afterEach(() => {});

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendEmail', () => {
    it('should work', async () => {
      expect(service.sendEmail(receiver, 'test', '<div>test123</div>')).resolves.not.toThrow();
    });

    describe('should throw error when', () => {
      it('empty receiver', async () => {
        await expect(service.sendEmail('', 'test', '<div>test123</div>')).rejects.toThrow();
      });
    });
  });
});
