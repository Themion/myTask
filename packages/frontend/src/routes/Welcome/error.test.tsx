import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';
import welcomeRouteObject from '.';

describe('App', () => {
  let screen: RenderResult;
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: () => {},
      warn: console.warn,
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

  describe('Welcome - Error', () => {
    describe('should throw error when', () => {
      it('insufficient path', async () => {
        screen = renderWithRouter('/welcome');
        await waitFor(() => expect(testQueryClient.isMutating()).toEqual(0));

        const text = screen.getByText('Path Error : You need encoded email to join via this page!');
        expect(text).toBeDefined();
      });

      it('invalid string', async () => {
        screen = renderWithRouter('/welcome/@@@');
        await waitFor(() => expect(testQueryClient.isMutating()).toEqual(0));

        const text = screen.getByText('Parse Error : Given string cannot be parsed to UUID!');
        expect(text).toBeDefined();
      });

      it('invalid uuid', async () => {
        screen = renderWithRouter('/welcome/6aa6ee8e-a4f8-49f6-817f-1c9342aae29e');
        await waitFor(() => expect(testQueryClient.isMutating()).toEqual(0));

        const text = screen.getByText('UUID cannot be found: Wrong DTO!');
        expect(text).toBeDefined();
      });
    });
  });
});
