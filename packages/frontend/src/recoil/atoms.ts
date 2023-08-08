import { atom } from 'recoil';

export const shouldRefreshAtom = atom({
  key: 'shouldRefresh',
  default: true,
});
