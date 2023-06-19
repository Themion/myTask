import { expect } from 'chai';
import { describe, it } from 'mocha';
import PORT_RULE from './port';

describe('port', () => {
  it('should work with numeric number in range', () => {
    const before = '3000';
    const after = PORT_RULE.parse(before);
    expect(after).to.equal(parseInt(before));
  });

  describe('should make error with range', () => {
    it('value < 0 (out of port range)', () => {
      const before = '-123';
      expect(() => PORT_RULE.parse(before)).to.throw();
    });

    it('0 <= vaule <= 1024 (system port range)', () => {
      const before = '123';
      expect(() => PORT_RULE.parse(before)).to.throw();
    });

    it('65535 < vaule (out of port range)', () => {
      const before = '70000';
      expect(() => PORT_RULE.parse(before)).to.throw();
    });
  });

  describe('should make error with type', () => {
    it('non-numeric string', () => {
      const before = 'nom-numeric';
      expect(() => PORT_RULE.parse(before)).to.throw();
    });

    it('number', () => {
      const before = 123;
      expect(() => PORT_RULE.parse(before)).to.throw();
    });

    it('boolean', () => {
      const before = true;
      expect(() => PORT_RULE.parse(before)).to.throw();
    });

    it('undefined', () => {
      const before = undefined;
      expect(() => PORT_RULE.parse(before)).to.throw();
    });

    it('null', () => {
      const before = null;
      expect(() => PORT_RULE.parse(before)).to.throw();
    });

    it('function', () => {
      const before = () => {};
      expect(() => PORT_RULE.parse(before)).to.throw();
    });
  });
});
