import { QueryClient } from '@tanstack/react-query';
import { RenderResult, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server } from '~/mock';
import { GroupListParam } from '~/types';
import groupRouteObject from '..';

describe('GroupList', () => {
  let screen: RenderResult;
  let client: QueryClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const renderWithQuery = (param: Partial<GroupListParam>) => {
    const paramArr = Object.entries(param).map(([key, value]) => `${key}=${value}`);
    const router = createMemoryRouter([groupRouteObject], {
      initialEntries: [`/group?${paramArr.join('&')}`],
    });
    const renderResult = render(<RouterProvider router={router} />);
    screen = renderResult.screen;
    client = renderResult.client;
  };

  describe('without param', () => {
    beforeEach(() => renderWithQuery({}));

    it('before loading', () => {
      expect(screen.queryByText('loading')).toBeDefined();
      expect(client.isFetching()).toEqual(1);

      const prevButton = screen.queryByText('prev');
      expect(prevButton).toBeDefined();

      const nextButton = screen.queryByText('next');
      expect(nextButton).toBeDefined();
    });

    it('after loading', async () => {
      await waitFor(() => expect(client.isFetching()).toEqual(0));
      const list = screen.getAllByText(/name\d+/i);
      expect(list.length).toEqual(10);

      const prevButton = screen.getByText('prev') as HTMLButtonElement;
      const nextButton = screen.getByText('next') as HTMLButtonElement;

      expect(prevButton.disabled).toEqual(true);
      expect(nextButton.disabled).toEqual(false);
    });
  });

  it('with page param', async () => {
    renderWithQuery({ page: 2 });

    await waitFor(() => expect(client.isFetching()).toEqual(0));
    const list = screen.getAllByText(/name\d+/i);
    expect(list.length).toEqual(3);

    const prevButton = screen.getByText('prev') as HTMLButtonElement;
    const nextButton = screen.getByText('next') as HTMLButtonElement;

    expect(prevButton.disabled).toEqual(false);
    expect(nextButton.disabled).toEqual(true);
  });
});
