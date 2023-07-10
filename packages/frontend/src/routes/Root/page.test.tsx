import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';
import Root from './page';

describe('App', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('renders', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Root />
      </QueryClientProvider>,
    );
    const linkElement = screen.getByText(/Vite \+ React/i);
    expect(linkElement).toBeDefined();
  });
});
