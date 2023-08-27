import { QueryClient } from '@tanstack/react-query';
import { RenderResult, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, vi } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server } from '~/mock';
import GroupLeave from '.';

describe('GroupLeave', () => {
  let screen: RenderResult;
  let client: QueryClient;
  let openButton: HTMLElement | null;
  let cancelButton: HTMLElement | null;
  let submitButton: HTMLElement | null;
  let showModalFunc: ReturnType<typeof vi.fn>;
  let closeFunc: ReturnType<typeof vi.fn>;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    showModalFunc = vi.fn();
    HTMLDialogElement.prototype.showModal = showModalFunc;
    closeFunc = vi.fn();
    HTMLDialogElement.prototype.close = closeFunc;
  });

  beforeEach(() => {
    const renderResult = render(
      <MemoryRouter>
        <GroupLeave groupId={123} />
      </MemoryRouter>,
    );
    screen = renderResult.screen;
    client = renderResult.client;

    openButton = screen.queryByText('Leave Group');
    cancelButton = screen.queryByText('Cancel');
    submitButton = screen.queryByText('Leave');
  });

  it('should render', () => {
    expect(screen).toBeDefined();
    expect(client).toBeDefined();
  });

  it('should have expected elements', () => {
    expect(openButton).not.toBeNull();
    expect(cancelButton).not.toBeNull();
    expect(submitButton).not.toBeNull();
  });

  it('should show modal', async () => {
    fireEvent.click(openButton as HTMLButtonElement);
    expect(showModalFunc).toBeCalled();
  });

  describe('event', () => {
    it('cancel button', async () => {
      fireEvent.click(cancelButton as HTMLButtonElement);
      expect(client.isMutating()).toEqual(0);
      expect(closeFunc).toBeCalled();
    });

    it('submit button', async () => {
      fireEvent.click(submitButton as HTMLButtonElement);
      expect(client.isMutating()).toEqual(1);
      await waitFor(() => expect(client.isMutating()).toEqual(0));
      expect(closeFunc).not.toBeCalled();
    });
  });
});
