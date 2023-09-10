import { QueryClient } from '@tanstack/react-query';
import { RenderResult, fireEvent, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server } from '~/mock';
import groupRouteObject from '..';

describe('GroupList', () => {
  let screen: RenderResult;
  let client: QueryClient;
  let groupId: number;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  const renderWithQuery = (groupId: number) => {
    const router = createMemoryRouter([groupRouteObject], {
      initialEntries: [`/group/${groupId}`],
    });
    const renderResult = render(<RouterProvider router={router} />);
    screen = renderResult.screen;
    client = renderResult.client;
  };

  describe('should work', () => {
    beforeEach(() => {
      groupId = 1;
      renderWithQuery(groupId);
    });

    it('when loading', () => {
      expect(screen.queryByText('loading...')).not.toBeNull();
      expect(client.isFetching()).toEqual(1);
      expect(client.isMutating()).toEqual(1);

      const button = screen.queryByText('Load More User');
      expect(button).not.toBeNull();
    });

    it('fetch completed', async () => {
      await waitFor(() => expect(client.isFetching()).toEqual(0));
      const heading = screen.queryByText(`name${groupId}`);

      expect(heading).not.toBeNull();
    });

    describe('mutation completed', async () => {
      it('member list', async () => {
        const memberRegExp = /^test\d+@email.com( \(manager\))?$/;
        const filterMember = (itemlist: HTMLElement[]) =>
          itemlist.filter((listitem) => memberRegExp.test(listitem.textContent ?? ''));

        const button = screen.getByText('Load More User');
        await waitFor(() => expect(client.isMutating()).toEqual(0));

        const itemsBeforeClick = filterMember(screen.getAllByRole('listitem'));
        expect(itemsBeforeClick.length).toEqual(30);

        fireEvent.click(button);
        expect(client.isMutating()).toEqual(1);
        await waitFor(() => expect(client.isMutating()).toEqual(0));

        const itemsAfterClick = filterMember(screen.getAllByRole('listitem'));
        expect(itemsAfterClick.length).toEqual(33);
      });
    });
  });
});
