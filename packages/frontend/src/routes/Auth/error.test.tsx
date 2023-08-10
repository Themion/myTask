import { QueryClient } from '@tanstack/react-query';
import { RenderResult, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { invalidUUID, render, server } from '~/mock';
import authRouteObject from '.';

describe('Auth - Error', () => {
  let screen: RenderResult;
  let client: QueryClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const renderWithRouter = (path: string) => {
    const router = createMemoryRouter([authRouteObject], {
      initialEntries: [path],
    });
    return render(<RouterProvider router={router} />);
  };

  describe('should throw error when', () => {
    it('invalid string', async () => {
      const renderResult = renderWithRouter('/auth/@@@');
      screen = renderResult.screen;
      client = renderResult.client;
      await waitFor(() => expect(client.isMutating()).toEqual(0));

      const text = screen.getByText('Parse Error : Given string cannot be parsed to UUID!');
      expect(text).toBeDefined();
    });

    it('invalid uuid', async () => {
      const renderResult = renderWithRouter(`/auth/${invalidUUID}`);
      screen = renderResult.screen;
      client = renderResult.client;
      await waitFor(() => expect(client.isMutating()).toEqual(0));

      const text = screen.getByText('UUID cannot be found: Wrong DTO!');
      expect(text).toBeDefined();
    });
  });
});
