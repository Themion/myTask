import { JsonObject, mergeObjects } from '@my-task/common';
import { BE_ORIGIN, DEFAULT_FETCH_OPTIONS } from '~/constants';
import { FetchOptions } from '~/types';

const getBody = <Input extends JsonObject>({ body }: FetchOptions<Input>) => ({
  body: body ? JSON.stringify(body) : null,
});

const _fetch = async <Output = any, Input extends JsonObject = JsonObject>(
  path: string,
  option: FetchOptions<Input> = {},
) => {
  const url = new URL(path, BE_ORIGIN);

  const fetchOption = mergeObjects(getBody(option), option, DEFAULT_FETCH_OPTIONS) as RequestInit;

  const res = await fetch(url.href, fetchOption);
  const data = await res.json();

  if (!res.ok) throw { ...data, status: res.status };
  return data as Output;
};

export default _fetch;
