import { expect } from 'chai';
import { describe, it } from 'mocha';
import { ZodIssueCode } from 'zod';
import HOST_RULE from './host';

describe('host', () => {
  const v4 = 256;
  const randint = (val: number = 1) => Math.floor(Math.random() * Math.floor(val));

  describe('should work with', () => {
    it('ipv4', () => {
      const ip = `${randint(v4 - 1) + 1}.${randint(v4)}.${randint(v4)}.${randint(v4)}`;
      expect(() => HOST_RULE.parse(ip)).not.throw();
    });

    it('localhost', () => {
      expect(() => HOST_RULE.parse('localhost')).not.throw();
    });

    it('docker host', () => {
      expect(() => HOST_RULE.parse('host.docker.internal')).not.throw();
    });
  });

  describe('should throw error when', () => {
    describe('type', () => {
      it('number', () => {
        const before = randint(v4);
        expect(() => HOST_RULE.parse(before)).throw();
      });

      it('boolean', () => {
        const before = true;
        expect(() => HOST_RULE.parse(before)).throw();
      });

      it('undefined', () => {
        const before = undefined;
        expect(() => HOST_RULE.parse(before)).throw();
      });

      it('null', () => {
        const before = null;
        expect(() => HOST_RULE.parse(before)).throw();
      });

      it('function', () => {
        const before = () => {};
        expect(() => HOST_RULE.parse(before)).throw();
      });
    });

    describe('value', () => {
      it('ipv4 starting with 0', () => {
        const ip = `0.${randint(v4)}.${randint(v4)}.${randint(v4)}`;
        expect(() => HOST_RULE.parse(ip)).throw(ZodIssueCode.invalid_string);
      });
    });
  });
});
