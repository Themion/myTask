import { mergeObjects } from '@my-task/common';
import { BE_ORIGIN, DEFAULT_FETCH_OPTION } from '~/constants';

type RequestOption = Omit<RequestInit, 'body'> & {
  body?: { [key: string]: any };
};

const getBody = (option: RequestOption) => {
  const body = option.body && JSON.stringify(option.body);
  delete option.body;
  return body;
};

const fetchCore = async (path: string, option: RequestOption = {}) => {
  const body = getBody(option);
  const url = new URL(path, BE_ORIGIN);

  const fetchOption = { ...mergeObjects(option, DEFAULT_FETCH_OPTION), body } as RequestInit;

  const res = await fetch(url.href, fetchOption);
  return res.json();
};

export default fetchCore;
