import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, render, waitFor } from '@testing-library/react';
import { RouteObject, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { describe, expect, it } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';
import authRouteObject from '.';

describe('Auth - Confirm', () => {
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
    router = createMemoryRouter([rootRouteObject, authRouteObject], {
      initialEntries: [path],
    });
    return render(
      <QueryClientProvider client={testQueryClient}>
        <RecoilRoot>
          <RouterProvider router={router} />
        </RecoilRoot>
      </QueryClientProvider>,
    );
  };

  describe('should work', () => {
    beforeEach(() => {
      screen = renderWithRouter('/auth/993ae2a1-2554-404c-8a86-660b5ee7fedd');
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
