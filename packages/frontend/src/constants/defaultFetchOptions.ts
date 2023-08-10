import { JsonObject } from '@my-task/common';
import HttpMethod from './HttpMethod';

const DEFAULT_FETCH_OPTIONS: Partial<Pick<JsonObject, keyof RequestInit>> = {
  method: HttpMethod.GET,
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
};

export default DEFAULT_FETCH_OPTIONS;
