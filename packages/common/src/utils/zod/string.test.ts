import { expect } from 'chai';
import { describe, it } from 'mocha';
import STRING_RULE from './string';

describe('string', () => {
  describe('should work with', () => {
    it('string', () => {
      const before = 'string';
      const after = STRING_RULE.parse(before);
      expect(after).equal(before);
    });
  });

  describe('should throw error when', () => {
    describe('type', () => {
      it('number', () => {
        const before = 123;
        expect(() => STRING_RULE.parse(before)).throw();
      });

      it('boolean', () => {
        const before = true;
        expect(() => STRING_RULE.parse(before)).throw();
      });

      it('object', () => {
        const before = { foo: 'bar' };
        expect(() => STRING_RULE.parse(before)).throw();
      });

      it('undefined', () => {
        const before = undefined;
        expect(() => STRING_RULE.parse(before)).throw();
      });

      it('null', () => {
        const before = null;
        expect(() => STRING_RULE.parse(before)).throw();
      });

      it('function', () => {
        const before = () => {};
        expect(() => STRING_RULE.parse(before)).throw();
      });
    });

    describe('value', () => {
      it('empty string', () => {
        const before = '';
        expect(() => STRING_RULE.parse(before)).throw();
      });
    });
  });
});
