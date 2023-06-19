import { expect } from 'chai';
import { describe, it } from 'mocha';
import NUMERIC_STRING_RULE from './numericString';

describe('numericString', () => {
  it('should work with numeric string', () => {
    const before = '300';
    const after = NUMERIC_STRING_RULE.parse(before);
    expect(after).to.equal(parseInt(before));
  });

  describe('should make error with', () => {
    it('non-numeric string', () => {
      const before = 'nom-numeric';
      expect(() => NUMERIC_STRING_RULE.parse(before)).to.throw();
    });

    it('number', () => {
      const before = 123;
      expect(() => NUMERIC_STRING_RULE.parse(before)).to.throw();
    });

    it('boolean', () => {
      const before = true;
      expect(() => NUMERIC_STRING_RULE.parse(before)).to.throw();
    });

    it('undefined', () => {
      const before = undefined;
      expect(() => NUMERIC_STRING_RULE.parse(before)).to.throw();
    });

    it('null', () => {
      const before = null;
      expect(() => NUMERIC_STRING_RULE.parse(before)).to.throw();
    });

    it('function', () => {
      const before = () => {};
      expect(() => NUMERIC_STRING_RULE.parse(before)).to.throw();
    });
  });
});
