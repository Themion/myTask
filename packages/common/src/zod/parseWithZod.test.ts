import { expect } from 'chai';
import { describe } from 'mocha';
import { z } from 'zod';
import parseWithZod from './parseWithZod';

describe('parseWithZod', () => {
  describe('should return data with', () => {
    it('simple schema', () => {
      const test = 'test';
      const zodStringSchema = z.string();
      const result = parseWithZod(test, zodStringSchema);
      expect(result).deep.equal({ success: true, data: test });
    });

    it('transformed schema', () => {
      const test = 123;
      const zodNumericStringSchema = z.number().transform(String);
      const result = parseWithZod(test, zodNumericStringSchema);

      expect(result.success).true;
      expect(result.data).equal(test.toString());
      expect(result.error).undefined;
    });
  });

  describe('should return error with', () => {
    it('invalid type', () => {
      const test = 123;
      const zodStringSchema = z.string();
      const result = parseWithZod(test, zodStringSchema);
      expect(result.success).false;
      expect(result.data).undefined;
      expect(result.error).not.undefined;
    });

    it('invalid string', () => {
      const test = 'invalid@string';
      const zodEmailSchema = z.string().email();
      const result = parseWithZod(test, zodEmailSchema);
      expect(result.success).false;
      expect(result.data).undefined;
      expect(result.error).not.undefined;
    });
  });
});
