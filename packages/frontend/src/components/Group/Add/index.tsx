import { FormEventHandler, MouseEventHandler, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGroup } from '~/api';
import { Modal } from '~/components';
import styles from './styles.module.scss';

const GroupAdd = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const mutation = createGroup({
    onSuccess: () => navigate(0),
  });

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

    const name = input.value;
    mutation.mutate({ name });
    if (modal) modal.close();
  };

  const isDisabled = mutation.isLoading;

  return (
    <>
      <button className={styles.add} onClick={onClick}>
        <span className={styles.text}>+</span>
      </button>
      <Modal title="New Group" ref={modalRef}>
        <form onSubmit={onSubmit}>
          <label htmlFor="group-name">Group Name: </label>
          <input id="group-name" type="text" ref={inputRef} />
          <button type="submit" disabled={isDisabled} aria-disabled={isDisabled}>
            create
          </button>
        </form>
      </Modal>
    </>
  );
};

export default GroupAdd;
