import { QueryClient } from '@tanstack/react-query';
import { RenderResult, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, vi } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server } from '~/mock';
import GroupAdd from '.';

describe('GroupAdd', () => {
  let screen: RenderResult;
  let client: QueryClient;
  let addButton: HTMLElement | null;
  let nameInput: HTMLElement | null;
  let button: HTMLElement | null;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    const renderResult = render(
      <MemoryRouter>
        <GroupAdd />
      </MemoryRouter>,
    );
    screen = renderResult.screen;
    client = renderResult.client;

    addButton = screen.queryByText('+');
    nameInput = screen.queryByLabelText('Group Name:');
    button = screen.queryByText('create');
  });

  it('should have expected elements', () => {
    expect(addButton).not.toBeNull();
    expect(nameInput).not.toBeNull();
    expect(button).not.toBeNull();
  });

  it('should show modal', async () => {
    const showModalFunc = vi.fn();
    HTMLDialogElement.prototype.showModal = showModalFunc;

    fireEvent.click(addButton as HTMLButtonElement);
    expect(showModalFunc).toBeCalled();
  });

  it('should fire mutation', async () => {
    fireEvent.change(nameInput as HTMLInputElement, 'name');
    fireEvent.click(button as HTMLButtonElement);
    expect(client.isMutating()).toEqual(1);
    await waitFor(() => expect(client.isMutating()).toEqual(0));
  });
});
