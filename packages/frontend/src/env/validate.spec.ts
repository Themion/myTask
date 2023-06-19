import { beforeEach, describe, expect, it } from 'vitest';
import { ZodIssueCode } from 'zod';
import validate from './validate';

describe('env validation', () => {
  let testEnv: any;

  beforeEach(() => {
    testEnv = {
      FE_PORT: '5173',
      BE_PORT: '3000',
    };
  });

  describe('FE_PORT', () => {
    it('should be string input', () => {
      testEnv.FE_PORT = 5173;
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_type);
    });

    it('should be numeric string input', () => {
      testEnv.FE_PORT = 'non-numeric string';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_string);
    });

    it('should not be in system port range', () => {
      testEnv.FE_PORT = '1000';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_small);
    });

    it('should not be bigger than max port', () => {
      testEnv.FE_PORT = '100000';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_big);
    });

    it('should be a valid number', () => {
      const parsedEnv = validate(testEnv);
      expect(parsedEnv.FE_PORT).toEqual(parseInt(testEnv.FE_PORT));
    });
  });
});
