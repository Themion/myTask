import { ZodIssueCode } from 'zod';
import validate from './validate';

describe('env validation', () => {
  let testEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    testEnv = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_USER: 'a',
      DB_PASSWORD: 'a',
      DB_DB: 'a',

      REDIS_HOST: 'localhost',
      REDIS_PORT: '6379',
      REDIS_USER: 'aa',
      REDIS_PASS: 'a',

      JWT_PUBLIC_KEY: 'a',
      JWT_PRIVATE_KEY: 'a',

      BE_PORT: '3000',

      EMAIL_HOST: 'smtp.gmail.com',
      EMAIL_PORT: '587',
      EMAIL_USER: 'a',
      EMAIL_PASS: 'a',
      EMAIL_SENDER: 'test@example.com',

      FE_HOST: 'localhost',
      FE_PORT: '5173',
    };
  });

  it('should work', () => {
    expect(validate(testEnv)).toBeDefined();
  });

  describe('should throw error when', () => {
    it('invalid field value', () => {
      testEnv.BE_PORT = 'test123';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
    });

    it('duplicate port', () => {
      testEnv.BE_PORT = testEnv.FE_PORT;
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
    });
  });
});
