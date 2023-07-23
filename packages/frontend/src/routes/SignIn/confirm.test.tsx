import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render, waitFor } from '@testing-library/react';
import { RouteObject, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';
import signInRouteObject from '.';

describe('App', () => {
  it('no test suite', () => {
    expect(1).toEqual(1);
  });

  let screen: RenderResult;
  let router: ReturnType<typeof createMemoryRouter>;
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

  const renderWithRouter = (path: string) => {
    const rootRouteObject: RouteObject = { path: '', element: <div>redirected!</div> };
    router = createMemoryRouter([rootRouteObject, signInRouteObject], {
      initialEntries: [path],
    });
    return render(
      <QueryClientProvider client={testQueryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    );
  };

  describe('Welcome', () => {
    describe('should work', () => {
      beforeEach(() => {
        screen = renderWithRouter('/signin/993ae2a1-2554-404c-8a86-660b5ee7fedd');
      });

      it('when loading', async () => {
        const text = screen.getByText('Loading...');
        expect(text).toBeDefined();
      });

      it('when success', async () => {
        await waitFor(() => expect(testQueryClient.isMutating()).toEqual(0));

        const text = screen.getByText('Welcome, success@example.com!');
        expect(text).toBeDefined();
      });
    });
  });
});
