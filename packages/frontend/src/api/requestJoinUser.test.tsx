import { RequestJoinUserDTO, User } from '@my-task/common';
import { QueryClient, QueryClientProvider, UseMutationResult } from '@tanstack/react-query';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { describe, expectTypeOf } from 'vitest';
import requestJoinUser from '~/api/requestJoinUser';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';

describe('requestJoinUser', () => {
  let renderedHook: RenderHookResult<UseMutationResult<any, any, RequestJoinUserDTO, any>, unknown>;

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
    renderedHook = renderHook(() => requestJoinUser({}), { wrapper });
  });

  afterEach(() => {
    testQueryClient.clear();
  });

  it('should work', async () => {
    const dto: RequestJoinUserDTO = { email: 'test@email.com' };
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
