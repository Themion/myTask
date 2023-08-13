import { MouseEventHandler, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { removeAuth } from '~/api';
import Modal from '~/components/Modal';
import { shouldRefreshAtom } from '~/recoil/atoms';
import AuthRequest from '~/routes/Auth/request';

const AuthMenu = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [refreshed, setRefreshed] = useRecoilState(shouldRefreshAtom);

  const signOutMutation = removeAuth({
    onError: (err) => console.log(err),
    onSettled: () => setRefreshed(false),
  });

  const onSignInClick: MouseEventHandler = () => {
    const modal = modalRef.current;
    if (!modal) return;

    modal.showModal();
  };

  const onSignOutClick: MouseEventHandler = () => {
    signOutMutation.mutate({});
  };

  return refreshed ? (
    <span onClick={onSignOutClick}>sign out</span>
  ) : (
    <>
      <span onClick={onSignInClick}>sign in</span>
      <Modal title="Test Title" ref={modalRef}>
        <AuthRequest />
      </Modal>
    </>
  );
};

export default AuthMenu;
