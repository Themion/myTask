import { CreateUserConfirmDTO, User } from '@my-task/common';
import { QueryClient, QueryClientProvider, UseMutationResult } from '@tanstack/react-query';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { describe, expectTypeOf } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';
import createUserConfirm from './joinUserConfirm';

describe('postJoin', () => {
  let renderedHook: RenderHookResult<
    UseMutationResult<any, any, CreateUserConfirmDTO, any>,
    unknown
  >;

  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
  );

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  beforeEach(() => {
    renderedHook = renderHook(() => createUserConfirm({}), { wrapper });
  });

  afterEach(() => {
    testQueryClient.clear();
  });

  it('should work', async () => {
    const dto: CreateUserConfirmDTO = { uuid: '993ae2a1-2554-404c-8a86-660b5ee7fedd' };
    renderedHook.result.current.mutate(dto);
    await waitFor(() => expect(renderedHook.result.current.isSuccess).toEqual(true));

    const data = renderedHook.result.current.data;
    expectTypeOf(data).toMatchTypeOf<User>();
    expect(data.email).toEqual('success@example.com');
  });

  describe('should fail with', () => {
    it('invalid email', async () => {
      const dto: CreateUserConfirmDTO = { uuid: '6aa6ee8e-a4f8-49f6-817f-1c9342aae29e' };
      renderedHook.result.current.mutate(dto);
      await waitFor(() => expect(renderedHook.result.current.isError).toEqual(true));
    });
  });
});
