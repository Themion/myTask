import { mergeObjects } from '@my-task/common';
import { BE_ORIGIN, DEFAULT_FETCH_OPTION } from '~/constants';

const getBody = (option: RequestInit) => {
  const body = option.body && JSON.stringify(option.body);
  delete option.body;
  return body;
};

const fetchCore = async (path: string, option: RequestInit = {}) => {
  const body = getBody(option);
  const url = new URL(path, BE_ORIGIN);

  option = { ...mergeObjects(option, DEFAULT_FETCH_OPTION), body } as RequestInit;

  const res = await fetch(url.href, option);
  return res.json();
};

export default fetchCore;
