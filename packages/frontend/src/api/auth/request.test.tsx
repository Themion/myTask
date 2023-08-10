import { RequestAuthDTO, User } from '@my-task/common';
import { QueryClient, UseMutationResult } from '@tanstack/react-query';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { describe, expectTypeOf } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server, validEmail } from '~/mock';
import requestAuth from './request';

describe('requestAuth', () => {
  let renderedHook: RenderHookResult<UseMutationResult<any, any, RequestAuthDTO, any>, unknown>;
  let client: QueryClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    renderedHook = renderHook(() => requestAuth({}), {
      wrapper: ({ children }) => {
        const renderResult = render(children);
        client = renderResult.client;
        return renderResult.element;
      },
    });
  });

  afterEach(() => client.clear());

  it('should work', async () => {
    const dto: RequestAuthDTO = { email: validEmail };
    renderedHook.result.current.mutate(dto);
    await waitFor(() => expect(renderedHook.result.current.isSuccess).toEqual(true));

    const data = renderedHook.result.current.data;
    expectTypeOf(data).toMatchTypeOf<User>();
    expect(data.email).toEqual(dto.email);
  });

  describe('should fail with', () => {
    it('invalid email', async () => {
      renderedHook.result.current.mutate({ email: 'invalid@email' });
      await waitFor(() => expect(renderedHook.result.current.isError).toEqual(true));
    });
  });
});
