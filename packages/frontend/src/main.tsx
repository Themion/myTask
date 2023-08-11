import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from '~/App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  //   <QueryClientProvider client={new QueryClient()}>
  //     <RouterProvider router={router} />
  //   </QueryClientProvider>
  // </React.StrictMode>,
  <QueryClientProvider client={new QueryClient()}>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </QueryClientProvider>,
);
