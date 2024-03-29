import { MouseEventHandler, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { removeAuth } from '~/api';
import { AuthComponent, Modal } from '~/components';
import { shouldRefreshAtom } from '~/recoil/atoms';

const AuthMenu = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const [refreshed, setRefreshed] = useRecoilState(shouldRefreshAtom);

  const signOutMutation = removeAuth({
    onError: (err) => console.log(err),
    onSettled: () => {
      setRefreshed(false);
      navigate(0);
    },
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
        <AuthComponent />
      </Modal>
    </>
  );
};

export default AuthMenu;
