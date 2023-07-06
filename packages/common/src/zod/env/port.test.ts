import { expect } from 'chai';
import { describe, it } from 'mocha';
import PORT_RULE from './port';

describe('port', () => {
  const SYSTEM_PORT_MAX = 1024;
  const PORT_MAX = 65535;

  const randint = (min: number, max: number) => {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  describe('should work with', () => {
    it('1024 < value <= 65535 (numeric number in range)', () => {
      const after = randint(SYSTEM_PORT_MAX, PORT_MAX);
      const before = after.toString();
      expect(after).equal(parseInt(before));
    });
  });

  describe('should throw error when', () => {
    describe('value', () => {
      it('value != round(value)', () => {
        const before = randint(SYSTEM_PORT_MAX, PORT_MAX) + Math.random();
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it('value < 0 (out of port range)', () => {
        const before = (randint(0, PORT_MAX) * -1).toString();
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it('0 <= vaule <= 1024 (system port range)', () => {
        const before = randint(0, SYSTEM_PORT_MAX).toString();
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it('65535 < vaule (out of port range)', () => {
        const before = randint(PORT_MAX, PORT_MAX + 1000).toString();
        expect(() => PORT_RULE.parse(before)).throw();
      });
    });

    describe('type', () => {
      it('non-numeric string', () => {
        const before = 'nom-numeric';
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it('number', () => {
        const before = 123;
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it('boolean', () => {
        const before = true;
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it('undefined', () => {
        const before = undefined;
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it('null', () => {
        const before = null;
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it('function', () => {
        const before = () => {};
        expect(() => PORT_RULE.parse(before)).throw();
      });
    });
  });
});
