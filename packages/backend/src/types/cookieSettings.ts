import { CookieOptions } from 'express';

type CookieSettings = {
  [key: string]: {
    val: string;
    options: CookieOptions;
  };
};

export default CookieSettings;
