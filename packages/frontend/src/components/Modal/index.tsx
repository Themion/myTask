import { ForwardedRef, MouseEventHandler, ReactNode, forwardRef } from 'react';
import styles from './styles.module.scss';

type Props = {
  title?: string;
  children: ReactNode;
};

const Modal = (props: Props, ref: ForwardedRef<HTMLDialogElement>) => {
  const { title, children } = props;

  const getModal = () => {
    return !ref || typeof ref === 'function' ? null : ref.current;
  };

  const closeModal = (modal: HTMLDialogElement | null = getModal()) => {
    if (!modal) return;
    modal.close();
  };

  const onOutsideClick: MouseEventHandler = (e) => {
    e.preventDefault();

    const modal = getModal();
    if (!modal) return;

    const { left, right, top, bottom } = modal.getBoundingClientRect();
    const { clientX, clientY } = e;

    if (left > clientX || clientX > right || top > clientY || clientY > bottom) closeModal(modal);
  };

  const onCloseButtonClick = () => {
    closeModal();
  };

  return (
    <dialog className={styles.modal} ref={ref} onClick={onOutsideClick}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <button type="button" className={styles.close} onClick={onCloseButtonClick}>
          x
        </button>
      </div>
      {children}
    </dialog>
  );
};

export default forwardRef<HTMLDialogElement, Props>(Modal);
