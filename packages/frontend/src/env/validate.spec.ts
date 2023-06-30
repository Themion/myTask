import { beforeEach, describe, expect, it } from 'vitest';
import { ZodIssueCode } from 'zod';
import validate from './validate';

describe('env validation', () => {
  let testEnv: any;

  beforeEach(() => {
    testEnv = {
      HOST: 'localhost',
      FE_PORT: '5173',
      BE_PORT: '3000',
    };
  });

  describe('HOST', () => {
    const v4 = 256;
    const randint = (val: number = 1) => Math.floor(Math.random() * Math.floor(val));

    describe('should work with', () => {
      it('ipv4', () => {
        testEnv.HOST = `${randint(v4 - 1) + 1}.${randint(v4)}.${randint(v4)}.${randint(v4)}`;
        expect(() => validate(testEnv)).not.toThrow();
      });

      it('localhost', () => {
        expect(() => validate(testEnv)).not.toThrow();
      });

      it('docker host', () => {
        testEnv.HOST = 'host.docker.internal';
        expect(() => validate(testEnv)).not.toThrow();
      });
    });
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
