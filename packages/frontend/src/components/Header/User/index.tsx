import { MouseEventHandler, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import Dropdown from '~/components/Dropdown';
import Modal from '~/components/Modal';
import { shouldRefreshAtom } from '~/recoil/atoms';
import AuthRequest from '~/routes/Auth/request';
import styles from './styles.module.scss';

const HeaderUser = () => {
  const refreshed = useRecoilValue(shouldRefreshAtom);
  const modalRef = useRef<HTMLDialogElement>(null);

  const onClick: MouseEventHandler = () => {
    const modal = modalRef.current;
    if (!modal) return;

    modal.showModal();
  };

  return (
    <Dropdown
      button={<span>user menu</span>}
      classList={[styles.user]}
      dropdownClassList={[styles.dropdown]}
    >
      {refreshed ? (
        <span>sign out</span>
      ) : (
        <>
          <span onClick={onClick}>sign in</span>
          <Modal title="Test Title" ref={modalRef}>
            <AuthRequest />
          </Modal>
        </>
      )}
    </Dropdown>
  );
};

export default HeaderUser;
