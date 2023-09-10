import { MemberListDTO } from '@my-task/common';
import { QueryClient, UseMutationResult } from '@tanstack/react-query';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { describe, expectTypeOf } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server } from '~/mock';
import { MemberListParam } from '~/types';
import fetchMemberList from './list';

describe('fetchMemberList', () => {
  let renderedHook: RenderHookResult<UseMutationResult<any, any, MemberListParam, any>, unknown>;
  let client: QueryClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  afterEach(() => client.clear());

  beforeEach(() => {
    renderedHook = renderHook(() => fetchMemberList({}), {
      wrapper: ({ children }) => {
        const renderResult = render(children);
        client = renderResult.client;
        return renderResult.element;
      },
    });
  });

  // cookie에 따라 다르게 동작함
  it('should work', async () => {
    renderedHook.result.current.mutate({ groupId: 0 });
    await waitFor(() => expect(renderedHook.result.current.isLoading).toEqual(false));

    const data = renderedHook.result.current.data;
    expect(data).toBeDefined();
    expectTypeOf(data as any).toHaveProperty('member');
    expect(data?.member.length).toEqual(30);
    expectTypeOf(data as any).toHaveProperty('count');
    expect(data?.count).toEqual(33);
  });

  it('should work with page query', async () => {
    renderedHook.result.current.mutate({ groupId: 0, page: 2 });
    await waitFor(() => expect(renderedHook.result.current.isLoading).toEqual(false));

    const { member, count } = renderedHook.result.current.data as MemberListDTO;
    expect(member).toBeDefined();
    expect(member.length).toEqual(3);
    expect(count).toEqual(33);
  });
});
