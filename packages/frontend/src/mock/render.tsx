import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import React from 'react';
import { RecoilRoot } from 'recoil';

const renderScreen = (ui: React.ReactElement) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: () => {},
      warn: () => {},
      error: () => {},
    },
  });

  const element = (
    <QueryClientProvider client={client}>
      <RecoilRoot>{ui}</RecoilRoot>
    </QueryClientProvider>
  );
  const screen = render(element);

  return { screen, element, client };
};

export default renderScreen;
