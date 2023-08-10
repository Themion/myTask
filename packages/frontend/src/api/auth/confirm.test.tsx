import { ConfirmAuthDTO } from '@my-task/common';
import { QueryClient, UseMutationResult } from '@tanstack/react-query';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { describe } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { invalidUUID, render, server, validEmail, validUUID } from '~/mock';
import confirmAuth from './confirm';

describe('confirmAuth', () => {
  let renderedHook: RenderHookResult<UseMutationResult<any, any, ConfirmAuthDTO, any>, unknown>;
  let client: QueryClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    renderedHook = renderHook(() => confirmAuth({}), {
      wrapper: ({ children }) => {
        const renderResult = render(children);
        client = renderResult.client;
        return renderResult.element;
      },
    });
  });

  afterEach(() => client.clear());

  it('should work', async () => {
    const dto: ConfirmAuthDTO = { uuid: validUUID };
    renderedHook.result.current.mutate(dto);
    await waitFor(() => expect(renderedHook.result.current.isSuccess).toEqual(true));

    const data = renderedHook.result.current.data;
    expect(data).toHaveProperty('email');
    expect(data.email).toEqual(validEmail);
  });

  describe('should fail with', () => {
    it('invalid email', async () => {
      const dto: ConfirmAuthDTO = { uuid: invalidUUID };
      renderedHook.result.current.mutate(dto);
      await waitFor(() => expect(renderedHook.result.current.isError).toEqual(true));
    });
  });
});
