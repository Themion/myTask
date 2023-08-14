import { QueryClient } from '@tanstack/react-query';
import { RenderResult, fireEvent } from '@testing-library/react';
import { useEffect, useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { describe, expect, it, vi } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server } from '~/mock';
import { shouldRefreshAtom } from '~/recoil/atoms';
import AuthMenu from '.';

describe('AuthMenu', () => {
  let screen: RenderResult;
  let client: QueryClient;
  let recoilSetter: HTMLElement;

  let menuItem: HTMLElement | null;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('should work', () => {
    beforeEach(() => {
      const recoilText = 'recoil';

      const RecoilSetter = () => {
        const setRefreshed = useSetRecoilState(shouldRefreshAtom);
        const [value, setValue] = useState(false);

        useEffect(() => setRefreshed(value), [value]);
        const onClick = () => setValue((val) => !val);

        return <div onClick={onClick}>{recoilText}</div>;
      };

      const renderResult = render(
        <MemoryRouter>
          <RecoilSetter />
          <AuthMenu />
        </MemoryRouter>,
      );
      screen = renderResult.screen;
      client = renderResult.client;

      recoilSetter = screen.getByText(recoilText);
    });
    afterEach(() => client.clear());

    it('should render', () => {
      expect(screen).toBeDefined();
    });

    describe('when signed out', () => {
      let showModalFunc: ReturnType<typeof vi.fn>;

      beforeEach(() => {
        showModalFunc = vi.fn();
        HTMLDialogElement.prototype.showModal = showModalFunc;

        menuItem = screen.queryByText('sign in');
      });

      it('should display sign in', async () => {
        expect(menuItem).toBeDefined();
      });

      it('should display modal when clicked', () => {
        fireEvent.click(menuItem as HTMLElement);
        expect(showModalFunc).toBeCalled();
      });
    });

    describe('when signed in', () => {
      beforeEach(() => {
        fireEvent.click(recoilSetter);
        menuItem = screen.queryByText('sign out');
      });

      it('should display sign in', async () => {
        expect(menuItem).toBeDefined();
      });

      it('should create query when clicked', () => {
        fireEvent.click(menuItem as HTMLElement);
        // response는 cookie에 따라 다르므로 테스트하지 않음
        expect(client.isMutating()).toEqual(1);
      });
    });
  });
});
