import { FormEventHandler, MouseEventHandler, useRef } from 'react';
import { inviteMember } from '~/api';
import { Modal } from '~/components';

type Props = {
  groupId: number;
};

const GroupInvite = (props: Props) => {
  const { groupId } = props;
  const modalRef = useRef<HTMLDialogElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const mutation = inviteMember({});

  const isDisabled = mutation.isLoading;

  const getElements = () => {
    const modal = modalRef.current;
    const emailInput = emailRef.current;
    const nameInput = nameRef.current;

    return { modal, emailInput, nameInput };
  };

  const onClick: MouseEventHandler = () => {
    const { modal } = getElements();
    if (!modal) return;

    modal.showModal();
  };

  const onSubmit: FormEventHandler = (e) => {
    e.preventDefault();

    const { modal, emailInput, nameInput } = getElements();
    if (!emailInput || !nameInput) return;

    const email = emailInput.value;
    const name = nameInput.value;
    mutation.mutate({ groupId, name, email });
    if (modal) modal.close();
  };

  return (
    <>
      <button onClick={onClick}>
        <span>Invite New Member</span>
      </button>
      <Modal title="Invite Member" ref={modalRef}>
        <form onSubmit={onSubmit}>
          <div>
            <label htmlFor="member-email">User E-Mail: </label>
            <input id="member-email" type="email" ref={emailRef} required aria-required />
          </div>
          <div>
            <label htmlFor="member-email">User Name: </label>
            <input id="member-name" type="text" ref={nameRef} required aria-required />
          </div>
          <button type="submit" disabled={isDisabled} aria-disabled={isDisabled}>
            Invite
          </button>
        </form>
      </Modal>
    </>
  );
};

export default GroupInvite;
