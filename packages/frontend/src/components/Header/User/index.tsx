import { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { shouldRefreshAtom } from '~/recoil/atoms';

const HeaderUser = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const refreshed = useRecoilValue(shouldRefreshAtom);

  const getElement = () => {
    const wrapper = parentRef.current;
    const dropdown = dropdownRef.current;

    return { dropdown, wrapper };
  };

  const onMenuClick = () => {
    const { dropdown } = getElement();
    if (!dropdown) return;

    dropdown.classList.toggle('hidden');
  };

  globalThis.addEventListener('click', (e) => {
    e.preventDefault();

    const { dropdown, wrapper } = getElement();
    if (!wrapper || !dropdown) return;

    if (!wrapper.contains(e.target as Node)) dropdown.classList.add('hidden');
  });

  return (
    <div className="header__user" ref={parentRef}>
      <span onClick={onMenuClick}>user menu</span>
      <div className="header__user--dropdown hidden" ref={dropdownRef}>
        {refreshed ? 'sign out' : 'sign in'}
      </div>
    </div>
  );
};

export default HeaderUser;
