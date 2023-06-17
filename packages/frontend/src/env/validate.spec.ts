import { beforeEach, describe, expect, it } from 'vitest';
import { ZodIssueCode } from 'zod';
import validate from './validate';

describe('env validation', () => {
  let testEnv: any;

  beforeEach(() => {
    testEnv = {
      VITE_FE_PORT: '5173',
      VITE_BE_PORT: '3000',
    };
  });

  describe('VITE_FE_PORT', () => {
    it('should be string input', () => {
      testEnv.VITE_FE_PORT = 3000;
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_type);
    });

    it('should be numeric string input', () => {
      testEnv.VITE_FE_PORT = 'non-numeric string';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.invalid_type);
    });

    it('should not be in system port range', () => {
      testEnv.VITE_FE_PORT = '1000';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_small);
    });

    it('should not be bigger than max port', () => {
      testEnv.VITE_FE_PORT = '100000';
      expect(() => validate(testEnv)).toThrow(ZodIssueCode.too_big);
    });

    it('should be a valid number', () => {
      const parsedEnv = validate(testEnv);
      expect(parsedEnv.VITE_FE_PORT).toEqual(parseInt(testEnv.VITE_FE_PORT));
    });

    it('should be unique port', () => {
      const parsedEnv = validate(testEnv);
      expect(parsedEnv.VITE_FE_PORT).not.toEqual(parseInt(testEnv.VITE_BE_PORT));
    });
  });
});
