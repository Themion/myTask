import { QueryClient } from '@tanstack/react-query';
import { RenderResult, waitFor } from '@testing-library/react';
import { RouteObject, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server, validEmail, validUUID } from '~/mock';
import authRouteObject from '.';

describe('Auth - Confirm', () => {
  let screen: RenderResult;
  let client: QueryClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('should work', () => {
    beforeEach(() => {
      const rootRouteObject: RouteObject = { path: '', element: <div>redirected!</div> };
      const router = createMemoryRouter([rootRouteObject, authRouteObject], {
        initialEntries: [`/auth/${validUUID}`],
      });
      const renderResult = render(<RouterProvider router={router} />);
      screen = renderResult.screen;
      client = renderResult.client;
    });
    afterEach(() => client.clear());

    it('when loading', async () => {
      const text = screen.getByText('Loading...');
      expect(text).toBeDefined();
    });

    it('when success', async () => {
      await waitFor(() => expect(client.isMutating()).toEqual(0));

      const text = screen.getByText(`Welcome, ${validEmail}!`);
      expect(text).toBeDefined();
    });
  });
});
