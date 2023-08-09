import { MINUTE } from '@my-task/common';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { refreshAuth } from '~/api';
import '~/index.css';
import router from '~/routes';

const App = () => {
  const [refresh, setRefresh] = useState(true);

  if (refresh) {
    const result = refreshAuth({
      refetchInterval: 10 * MINUTE,
      refetchIntervalInBackground: true,
    });

    if (result.error) setRefresh(false);
  }

  return (
    <QueryClientProvider client={new QueryClient()}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  //   <QueryClientProvider client={new QueryClient()}>
  //     <RouterProvider router={router} />
  //   </QueryClientProvider>
  // </React.StrictMode>,
  App(),
);
