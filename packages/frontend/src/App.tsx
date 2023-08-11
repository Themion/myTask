import { MINUTE } from '@my-task/common';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { refreshAuth } from '~/api';
import { Header } from '~/components';
import { shouldRefreshAtom } from '~/recoil/atoms';
import router from '~/routes';

const App = () => {
  const [refresh, setRefresh] = useRecoilState(shouldRefreshAtom);

  const result = refreshAuth({
    refetchInterval: 10 * MINUTE,
    refetchIntervalInBackground: true,
    enabled: refresh,
  });

  useEffect(() => {
    if (result.isLoading) return;
    else if (result.error) setRefresh(false);
    else if (result.data) setRefresh(result.data.refreshed || false);
  }, [result.isLoading]);

  return (
    <>
      <Header />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
