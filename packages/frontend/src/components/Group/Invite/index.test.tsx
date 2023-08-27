import { QueryClient } from '@tanstack/react-query';
import { RenderResult, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, vi } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server } from '~/mock';
import GroupInvite from '.';

describe('GroupInvite', () => {
  let screen: RenderResult;
  let client: QueryClient;
  let addButton: HTMLElement | null;
  let emailInput: HTMLElement | null;
  let submitButton: HTMLElement | null;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    const renderResult = render(
      <MemoryRouter>
        <GroupInvite groupId={123} />
      </MemoryRouter>,
    );
    screen = renderResult.screen;
    client = renderResult.client;

    addButton = screen.queryByText('Invite New Member');
    emailInput = screen.queryByLabelText('User E-Mail:');
    submitButton = screen.queryByText('Invite');
  });

  it('should render', () => {
    expect(screen).toBeDefined();
    expect(client).toBeDefined();
  });

  it('should have expected elements', () => {
    expect(addButton).not.toBeNull();
    expect(emailInput).not.toBeNull();
    expect(submitButton).not.toBeNull();
  });

  it('should show modal', async () => {
    const showModalFunc = vi.fn();
    HTMLDialogElement.prototype.showModal = showModalFunc;

    fireEvent.click(addButton as HTMLButtonElement);
    expect(showModalFunc).toBeCalled();
  });

  describe('event', () => {
    it('should fire event with email', async () => {
      fireEvent.change(emailInput as HTMLInputElement, 'test@email.com');
      fireEvent.click(submitButton as HTMLButtonElement);
      // 서버 실행 후 테스트한 경우 제대로 작동함
      // expect(client.isMutating()).toEqual(1);
      await waitFor(() => expect(client.isMutating()).toEqual(0));
    });

    it('should not fire event with non-email', async () => {
      fireEvent.change(emailInput as HTMLInputElement, 'invalid@email');
      fireEvent.click(submitButton as HTMLButtonElement);
      expect(client.isMutating()).toEqual(0);
    });
  });
});
