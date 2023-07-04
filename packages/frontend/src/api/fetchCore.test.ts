import { describe, expect } from 'vitest';
import fetchCore from '~/api/fetchCore';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';

describe('fetchCore', () => {
  beforeAll(() => server.listen());
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('should work with', () => {
    it('no body', async () => {
      const result = await fetchCore('/');
      expect(result).toStrictEqual({ foo: 'bar' });
    });

    it('body', async () => {
      const body = { date: new Date().getTime() };
      const result = await fetchCore('/', { method: 'POST', body });
      expect(result).toStrictEqual(body);
    });
  });

  describe('should throw error when', () => {
    it('invalid path', () => {
      const path = '/invalid/path';
      expect(async () => fetchCore(`${BE_ORIGIN}${path}`)).rejects.toThrow();
    });

    it('invalid method', () => {
      const path = '/';
      expect(async () =>
        fetchCore(`${BE_ORIGIN}${path}`, { method: 'WRONG_METHOD' }),
      ).rejects.toThrow();
    });
  });
});
