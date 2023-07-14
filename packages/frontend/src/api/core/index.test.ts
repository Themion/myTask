import { describe, expect } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';
import _fetch from '.';

describe('_fetch', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('should work with', () => {
    it('no body', async () => {
      const result = await _fetch('/');
      expect(result).toStrictEqual({ foo: 'bar' });
    });

    it('body', async () => {
      const body = { date: new Date().getTime() };
      const result = await _fetch('/', { method: 'POST', body });
      expect(result).toStrictEqual(body);
    });
  });

  describe('should throw error when', () => {
    it('invalid path', () => {
      const path = '/invalid/path';
      expect(async () => _fetch(path)).rejects.toThrow();
    });

    it('invalid method', () => {
      const path = '/';
      expect(async () => _fetch(path, { method: 'WRONG_METHOD' })).rejects.toThrow();
    });

    it('error thrown in server', () => {
      const path = '/error';
      expect(async () => _fetch(path)).rejects.toThrow();
    });
  });
});
