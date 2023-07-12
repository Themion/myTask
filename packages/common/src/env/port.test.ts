import { expect } from 'chai';
import { describe, it } from 'mocha';
import PORT_RULE from './port';

describe('port', () => {
  const PORT_MIN = 0;
  const PORT_MAX = 65535;

  const randint = (min: number, max: number) => {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  describe('should work with', () => {
    it(`${PORT_MIN} <= value <= ${PORT_MAX} (numeric number in range)`, () => {
      const after = randint(PORT_MIN, PORT_MAX);
      const before = after.toString();
      expect(PORT_RULE.parse(before)).equal(after);
    });
  });

  describe('should throw error when', () => {
    describe('value', () => {
      it('value != round(value)', () => {
        const before = randint(PORT_MIN, PORT_MAX) + Math.random();
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it(`value < ${PORT_MIN} (out of port range)`, () => {
        const before = (randint(0, PORT_MAX) * -1).toString();
        expect(() => PORT_RULE.parse(before)).throw();
      });

      it(`${PORT_MAX} < vaule (out of port range)`, () => {
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
