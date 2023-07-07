import { mergeObjects } from '@my-task/common';
import { BE_ORIGIN, DEFAULT_FETCH_OPTION } from '~/constants';

type BasicBodyType = { [key: string]: any };

type RequestOption<BodyType extends BasicBodyType> = Omit<RequestInit, 'body'> & {
  body?: BodyType;
};

const getBody = <Input extends BasicBodyType>({ body }: RequestOption<Input>) =>
  body && JSON.stringify(body);

const fetchCore = async <Output = any, Input extends BasicBodyType = BasicBodyType>(
  path: string,
  option: RequestOption<Input> = {},
) => {
  const body = getBody(option);
  const url = new URL(path, BE_ORIGIN);

  const fetchOption = mergeObjects({ body }, option, DEFAULT_FETCH_OPTION) as RequestInit;

  const res = await fetch(url.href, fetchOption);
  const data = await res.json();

  if (!res.ok) throw { ...data, status: res.status };
  return data as Output;
};

export default fetchCore;
