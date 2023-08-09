import { MINUTE } from '@my-task/common';
import { RouterProvider } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { refreshAuth } from '~/api';
import '~/index.css';
import { shouldRefreshAtom } from '~/recoil/atoms';
import router from '~/routes';

const App = () => {
  const [refresh, setRefresh] = useRecoilState(shouldRefreshAtom);

  const result = refreshAuth({
    refetchInterval: 10 * MINUTE,
    refetchIntervalInBackground: true,
    enabled: refresh,
  });

  if (result.error || !result.data?.refreshed) setRefresh(false);

  return <RouterProvider router={router} />;
};

export default App;
