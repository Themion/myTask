import { useQuery } from '@tanstack/react-query';
import _fetch from './core';

const getConnectionTest = () =>
  useQuery({
    queryKey: ['Connection Test'],
    queryFn: () => _fetch(''),
  });

export default getConnectionTest;
