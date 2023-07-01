import { useQuery } from '@tanstack/react-query';
import fetchCore from '~/api/fetchCore';

const getConnectionTest = () =>
  useQuery({
    queryKey: ['Connection Test'],
    queryFn: () => fetchCore(''),
  });

export default getConnectionTest;
