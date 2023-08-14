import { atom } from 'recoil';

const key = 'shouldRefresh';

export const shouldRefreshAtom = atom({
  key,
  default: false,
  effects: [
    ({ setSelf, onSet }) => {
      setSelf(localStorage.getItem(key) === 'true');
      onSet((val) => localStorage.setItem(key, val.toString()));
    },
  ],
});
