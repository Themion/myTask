import { useRef } from 'react';
import styles from './styles.module.scss';

const HeaderNav = () => {
  const parentRef = useRef<HTMLLIElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className={styles.nav}>
      <nav>
        <ul>
          <li onClick={onMenuClick} ref={parentRef}>
            menu 1
            <div className={`${styles.dropdown} ${styles.hidden}`} ref={dropdownRef}>
              menu 1 dropdown
            </div>
          </li>
          <li>menu 2</li>
          <li>menu 3</li>
        </ul>
      </nav>
    </div>
  );
};
export default HeaderNav;
