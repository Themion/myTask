import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RenderResult, fireEvent, render, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BE_ORIGIN } from '~/constants';
import { server } from '~/mock';
import SignUp from './page';

describe('SignUp', () => {
  let screen: RenderResult;
  const testQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  // https://stackoverflow.com/questions/76046546/fetch-error-typeerror-err-invalid-url-invalid-url-for-requests-made-in-test
  beforeEach(() => location.replace(BE_ORIGIN));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  afterEach(() => testQueryClient.clear());

  beforeEach(() => {
    screen = render(
      <QueryClientProvider client={testQueryClient}>
        <SignUp />
      </QueryClientProvider>,
      {},
    );
  });

  it('should have form for sign up', () => {
    const $input = screen.getByLabelText('E-Mail');
    expect($input).toBeDefined();
    expect($input instanceof HTMLInputElement).toEqual(true);
    expect($input.getAttribute('type')).toEqual('email');
    expect($input).toBeInTheDocument();

    const $button = screen.getByText('Sign Up');
    expect($button).toBeDefined();
    expect($button instanceof HTMLButtonElement).toEqual(true);
    expect($button.getAttribute('type')).toEqual('submit');
    expect($button).toBeInTheDocument();
  });

  describe('onSubmit', () => {
    it('should be able to fire event', async () => {
      const $input = screen.getByLabelText('E-Mail') as HTMLInputElement;
      const $button = screen.getByText('Sign Up') as HTMLButtonElement;
      const email = 'test@example.com';

      fireEvent.change($input, { target: { value: email } });
      fireEvent.click($button);

      await waitFor(() => expect(testQueryClient.isMutating()).toEqual(0));
      expect(() => screen.getByText(`User(${email}) has successfully joined!`)).not.toThrow();
    });

    it('should not fire event with invalid email', async () => {
      const $input = screen.getByLabelText('E-Mail') as HTMLInputElement;
      const $button = screen.getByText('Sign Up') as HTMLButtonElement;

      fireEvent.change($input, { target: { value: 'test@.com' } });
      fireEvent.click($button);
      expect(testQueryClient.isMutating()).toEqual(0);
    });
  });
});
