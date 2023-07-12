import { expect } from 'chai';
import { describe } from 'mocha';
import SYSTEM_PORT_RULE from './systemPort';

describe('system port', () => {
  const PORT_MIN = 0;
  const SYSTEM_PORT_MAX = 1023;

  const randint = (min: number, max: number) => {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  describe('should work with', () => {
    it(`${PORT_MIN} <= value <= ${SYSTEM_PORT_MAX} (numeric number in range)`, () => {
      const after = randint(PORT_MIN, SYSTEM_PORT_MAX);
      const before = after.toString();
      expect(SYSTEM_PORT_RULE.parse(before)).equal(after);
    });
  });

  describe('should throw error when', () => {
    it('value != round(value)', () => {
      const before = randint(PORT_MIN, SYSTEM_PORT_MAX) + Math.random();
      expect(() => SYSTEM_PORT_RULE.parse(before)).throw();
    });

    it(`value < ${PORT_MIN} (out of port range)`, () => {
      const before = (randint(0, SYSTEM_PORT_MAX) * -1).toString();
      expect(() => SYSTEM_PORT_RULE.parse(before)).throw();
    });

    it(`${SYSTEM_PORT_MAX} < vaule (out of port range)`, () => {
      const before = randint(SYSTEM_PORT_MAX, SYSTEM_PORT_MAX + 1000).toString();
      expect(() => SYSTEM_PORT_RULE.parse(before)).throw();
    });
  });
});
