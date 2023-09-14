type QueryObject = {
  [key: string]: string | number;
};

const objectToQueryString = (obj: QueryObject) => {
  const queryArr = Object.entries(obj).map(([key, val]) => `${key}=${val}`);
  return queryArr.length > 0 ? `?${queryArr.join('&')}` : '';
};

export default objectToQueryString;
