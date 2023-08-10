import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { invalidUUID, server } from '~/mock';
import welcomeRouteObject from '.';

describe('Auth - Error', () => {
  let screen: RenderResult;
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const renderWithRouter = (path: string) =>
    render(
      <QueryClientProvider client={testQueryClient}>
        <RouterProvider
          router={createMemoryRouter([welcomeRouteObject], {
            initialEntries: [path],
          })}
        />
      </QueryClientProvider>,
    );

  describe('should throw error when', () => {
    it('invalid string', async () => {
      screen = renderWithRouter('/auth/@@@');
      await waitFor(() => expect(testQueryClient.isMutating()).toEqual(0));

      const text = screen.getByText('Parse Error : Given string cannot be parsed to UUID!');
      expect(text).toBeDefined();
    });

    it('invalid uuid', async () => {
      screen = renderWithRouter(`/auth/${invalidUUID}`);
      await waitFor(() => expect(testQueryClient.isMutating()).toEqual(0));

      const text = screen.getByText('UUID cannot be found: Wrong DTO!');
      expect(text).toBeDefined();
    });
  });
});
