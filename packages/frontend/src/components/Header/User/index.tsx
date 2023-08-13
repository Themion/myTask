import { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { shouldRefreshAtom } from '~/recoil/atoms';
import styles from './styles.module.scss';

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

    dropdown.classList.toggle(styles.hidden);
  };

  globalThis.addEventListener('click', (e) => {
    e.preventDefault();

    const { dropdown, wrapper } = getElement();
    if (!wrapper || !dropdown) return;

    if (!wrapper.contains(e.target as Node)) dropdown.classList.add(styles.hidden);
  });

  return (
    <div className={styles.user} ref={parentRef}>
      <span onClick={onMenuClick}>user menu</span>
      <div className={`${styles.dropdown} ${styles.hidden}`} ref={dropdownRef}>
        {refreshed ? 'sign out' : 'sign in'}
      </div>
    </div>
  );
};

export default HeaderUser;
