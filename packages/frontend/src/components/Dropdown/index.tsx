import { ReactElement, ReactNode, cloneElement, useRef, useState } from 'react';
import styles from './styles.module.scss';

type Props = {
  button: ReactElement;
  children: ReactNode;
  classList?: string[];
  dropdownClassList?: string[];
};

const Dropdown = (props: Props) => {
  const { button, children } = props;
  const [display, setDisplay] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const clonedButton = cloneElement(button, { onClick: () => setDisplay((hidden) => !hidden) });

  globalThis.addEventListener('click', (e) => {
    e.preventDefault();

    const wrapper = wrapperRef.current;
    if (wrapper && !wrapper.contains(e.target as Node)) setDisplay(false);
  });

  const dropdownClassList = [styles.dropdown, ...(props.dropdownClassList ?? [])];

  return (
    <div ref={wrapperRef} className={(props.classList ?? []).join(' ')}>
      {clonedButton}
      {display && <div className={dropdownClassList.join(' ')}>{children}</div>}
    </div>
  );
};

export default Dropdown;
