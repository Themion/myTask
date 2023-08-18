import { CreateGroupDTO } from '@my-task/common';
import { QueryClient, UseMutationResult } from '@tanstack/react-query';
import { RenderHookResult, renderHook, waitFor } from '@testing-library/react';
import { describe } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { render, server } from '~/mock';
import createGroup from './create';

describe('createGroup', () => {
  let renderedHook: RenderHookResult<UseMutationResult<any, any, CreateGroupDTO, any>, unknown>;
  let client: QueryClient;
  let name: string;

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  afterEach(() => client.clear());

  beforeEach(() => {
    renderedHook = renderHook(() => createGroup({}), {
      wrapper: ({ children }) => {
        const renderResult = render(children);
        client = renderResult.client;
        return renderResult.element;
      },
    });

    name = 'name';
  });

  // cookie에 따라 다르게 동작함
  it('should work', async () => {
    renderedHook.result.current.mutate({ name });
    await waitFor(() => expect(renderedHook.result.current.isSuccess).toEqual(true));

    const data = renderedHook.result.current.data;
    expect(data).toBeDefined();
    expect(data).toHaveProperty('name');
    expect(data.name).toEqual(name);
  });
});
