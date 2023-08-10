import { FetchOptions } from '~/types';
import HttpMethod from './HttpMethod';

const DEFAULT_FETCH_OPTIONS: FetchOptions = {
  method: HttpMethod.GET,
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
};

export default DEFAULT_FETCH_OPTIONS;
