import { FormEventHandler, MouseEventHandler, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaveMember } from '~/api';
import { Modal } from '~/components';

type Props = {
  groupId: number;
};

const GroupLeave = (props: Props) => {
  const { groupId } = props;

  const modalRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();
  const mutation = leaveMember({
    onSuccess: () => navigate(0),
  });

  const isDisabled = mutation.isLoading;

  const onClick: MouseEventHandler = (e) => {
    e.preventDefault();

    const modal = modalRef.current;
    if (!modal) return;

    modal.showModal();
  };

  const onCancel: MouseEventHandler = (e) => {
    e.preventDefault();
    const modal = modalRef.current;
    if (!modal) return;

    modal.close();
  };

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    mutation.mutate({ groupId });
  };

  return (
    <>
      <button onClick={onClick}>
        <span>Leave Group</span>
      </button>
      <Modal title="Do you really want to leave this group?" ref={modalRef}>
        <form onSubmit={onSubmit}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" disabled={isDisabled} aria-disabled={isDisabled}>
            Leave
          </button>
        </form>
      </Modal>
    </>
  );
};

export default GroupLeave;
