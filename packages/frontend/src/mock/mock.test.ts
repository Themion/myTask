import { describe, expect } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';

describe('mock', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('should work when', () => {
    it('returned from server', async () => {
      const path = '/';
      const result = await fetch(`${BE_ORIGIN}${path}`);
      const data = await result.json();
      expect(data).toStrictEqual({ foo: 'bar' });
    });

    it('error thrown in server', async () => {
      const path = '/error';
      const result = await fetch(`${BE_ORIGIN}${path}`);
      expect(result.ok).toEqual(false);
      expect((await result.json()).errorMessage).toBeDefined();
    });
  });

  describe('should throw error when', () => {
    it('invalid path', () => {
      const path = '/invalid/path';
      expect(async () => fetch(`${BE_ORIGIN}${path}`)).rejects.toThrow();
    });

    it('invalid method', () => {
      const path = '/';
      expect(async () =>
        fetch(`${BE_ORIGIN}${path}`, { method: 'WRONG_METHOD' }),
      ).rejects.toThrow();
    });
  });
});
