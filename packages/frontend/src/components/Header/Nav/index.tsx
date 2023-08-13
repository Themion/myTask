import { useRef } from 'react';

const HeaderNav = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="header__nav">
      <nav>
        <ul className="header__nav--ul">
          <li onClick={onMenuClick}>
            menu 1
            <div className="header__nav--dropdown hidden" ref={dropdownRef}>
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
