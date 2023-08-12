import { useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { shouldRefreshAtom } from '~/recoil/atoms';

const HeaderUser = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const refreshed = useRecoilValue(shouldRefreshAtom);

  const getElement = () => {
    const wrapper = parentRef.current;
    const dialog = dialogRef.current;

    return { dialog, wrapper };
  };

  const onMenuClick = () => {
    const { dialog } = getElement();
    if (!dialog) return;

    dialog.open ? dialog.close() : dialog.show();
  };

  globalThis.addEventListener('click', (e) => {
    e.preventDefault();

    const { dialog, wrapper } = getElement();
    if (!dialog || !wrapper) return;

    if (!wrapper.contains(e.target as Node)) dialog.close();
  });

  return (
    <div className="header__user" ref={parentRef}>
      <span onClick={onMenuClick}>user menu</span>
      <dialog className="header__user--dialog" ref={dialogRef}>
        {refreshed ? 'sign out' : 'sign in'}
      </dialog>
    </div>
  );
};

export default HeaderUser;
