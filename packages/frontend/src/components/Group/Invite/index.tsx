import { FormEventHandler, MouseEventHandler, useRef } from 'react';
import { inviteMember } from '~/api';
import { Modal } from '~/components';

type Props = {
  groupId: number;
};

const GroupInvite = (props: Props) => {
  const { groupId } = props;
  const modalRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mutation = inviteMember({});

  const isDisabled = mutation.isLoading;

  const getElements = () => {
    const modal = modalRef.current;
    const input = inputRef.current;

    return { modal, input };
  };

  const onClick: MouseEventHandler = () => {
    const { modal } = getElements();
    if (!modal) return;

    modal.showModal();
  };

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const { modal, input } = getElements();
    if (!input) return;

    const email = input.value;
    mutation.mutate({ groupId, email });
    if (modal) modal.close();
  };

  return (
    <>
      <button onClick={onClick}>
        <span>Invite New Member</span>
      </button>
      <Modal title="Invite Member" ref={modalRef}>
        <form onSubmit={onSubmit}>
          <label htmlFor="member-email">User E-Mail: </label>
          <input id="member-email" type="email" ref={inputRef} required aria-required />
          <button type="submit" disabled={isDisabled} aria-disabled={isDisabled}>
            Invite
          </button>
        </form>
      </Modal>
    </>
  );
};

export default GroupInvite;
