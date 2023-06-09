import { JsonObject } from '@my-task/common';

const DEFAULT_FETCH_OPTIONS: Partial<Pick<JsonObject, keyof RequestInit>> = {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
};

export default DEFAULT_FETCH_OPTIONS;
