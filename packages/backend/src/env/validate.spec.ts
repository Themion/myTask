import { ZodIssueCode } from 'zod';
import validate from './validate';

describe('env validation', () => {
  let testEnv: any;

  beforeEach(() => {
    testEnv = {
      BE_PORT: '3000',
      DB_PORT: '5432',
    };
  });

  describe('BE_PORT', () => {
    it('should be string input', () => {
      testEnv.BE_PORT = 3000;
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_type);
    });

    it('should be numeric string input', () => {
      testEnv.BE_PORT = 'non-numeric string';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_type);
    });

    it('should not be in system port range', () => {
      testEnv.BE_PORT = '1000';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_small);
    });

    it('should not be bigger than max port', () => {
      testEnv.BE_PORT = '100000';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_big);
    });

    it('should be a valid number', () => {
      const parsedEnv = validate(testEnv);
      expect(parsedEnv.BE_PORT).toEqual(parseInt(testEnv.BE_PORT));
    });
  });
});
