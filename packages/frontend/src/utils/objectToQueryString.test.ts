import { expect } from 'vitest';
import objectToQueryString from './objectToQueryString';

describe('objectToQueryString', () => {
  describe('should work with', () => {
    it('string values', () => {
      const obj = { foo: 'bar', hello: 'world' };
      expect(objectToQueryString(obj)).toEqual('?foo=bar&hello=world');
    });

    it('number values', () => {
      const obj = { a: 1, b: 2 };
      expect(objectToQueryString(obj)).toEqual('?a=1&b=2');
    });

    it('mixed object', () => {
      const obj = { foo: 'bar', a: 123 };
      expect(objectToQueryString(obj)).toEqual('?foo=bar&a=123');
    });

    it('empty object', () => {
      expect(objectToQueryString({})).toEqual('');
    });
  });
});
