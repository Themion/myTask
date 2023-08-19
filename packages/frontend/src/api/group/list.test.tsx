import { GroupListDTO } from '@my-task/common';
import { QueryClient, UseQueryResult } from '@tanstack/react-query';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { describe, expectTypeOf } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server } from '~/mock';
import fetchGroupList from './list';

describe('fetchGroupList', () => {
  let renderedHook: RenderHookResult<UseQueryResult<GroupListDTO, any>, unknown>;
  let client: QueryClient;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  afterEach(() => client.clear());

  // cookie에 따라 다르게 동작함
  it('should work', async () => {
    renderedHook = renderHook(() => fetchGroupList({}, {}), {
      wrapper: ({ children }) => {
        const renderResult = render(children);
        client = renderResult.client;
        return renderResult.element;
      },
    });

    await waitFor(() => expect(renderedHook.result.current.isLoading).toEqual(false));

    const data = renderedHook.result.current.data;
    expect(data).toBeDefined();
    expectTypeOf(data as any).toHaveProperty('group');
    expect(data?.group.length).toEqual(10);
  });

  it('should work with page query', async () => {
    renderedHook = renderHook(() => fetchGroupList({}, { page: 2 }), {
      wrapper: ({ children }) => {
        const renderResult = render(children);
        client = renderResult.client;
        return renderResult.element;
      },
    });

    await waitFor(() => expect(renderedHook.result.current.isLoading).toEqual(false));

    const { group } = renderedHook.result.current.data as GroupListDTO;
    expect(group).toBeDefined();
    expect(group.length).toEqual(3);
  });
});
