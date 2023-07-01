import { useQuery } from '@tanstack/react-query';
import fetchCore from '~/api/core';

const getConnectionTest = () =>
  useQuery({
    queryKey: ['connection Test'],
    queryFn: () => fetchCore(''),
  });

export default getConnectionTest;
