import { expect } from 'chai';
import { describe } from 'mocha';
import USER_PORT_RULE from './userPort';

describe('user port', () => {
  const USER_PORT_MIN = 1024;
  const PORT_MAX = 65535;

  const randint = (min: number, max: number) => {
    min = Math.floor(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max + 1 - min)) + min;
  };

  describe('should work with', () => {
    it(`${USER_PORT_MIN} <= value <= ${PORT_MAX} (numeric number in range)`, () => {
      const after = randint(USER_PORT_MIN, PORT_MAX);
      const before = after.toString();
      expect(USER_PORT_RULE.parse(before)).equal(after);
    });
  });

  describe('should throw error when', () => {
    it('value != round(value)', () => {
      const before = randint(USER_PORT_MIN, PORT_MAX) + Math.random();
      expect(() => USER_PORT_RULE.parse(before)).throw();
    });

    it(`value < ${USER_PORT_MIN} (out of port range)`, () => {
      const before = (randint(0, PORT_MAX) * -1).toString();
      expect(() => USER_PORT_RULE.parse(before)).throw();
    });

    it(`${PORT_MAX} < vaule (out of port range)`, () => {
      const before = randint(PORT_MAX, PORT_MAX + 1000).toString();
      expect(() => USER_PORT_RULE.parse(before)).throw();
    });
  });
});
