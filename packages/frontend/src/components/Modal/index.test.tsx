import { RenderResult, createEvent, fireEvent, render } from '@testing-library/react';
import { RefObject, createRef } from 'react';
import { beforeEach, describe, vi } from 'vitest';
import Modal from '.';

describe('Modal', () => {
  let screen: RenderResult;

  let buttonText: string;
  let contentText: string;
  let outsideText: string;

  let modalRef: RefObject<HTMLDialogElement>;

  let content: HTMLElement;
  let button: HTMLElement;
  let outside: HTMLElement;
  let showModalFunc: ReturnType<typeof vi.fn>;
  let closeFunc: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    showModalFunc = vi.fn();
    closeFunc = vi.fn();
    HTMLDialogElement.prototype.showModal = showModalFunc;
    HTMLDialogElement.prototype.close = closeFunc;
  });

  beforeEach(() => {
    buttonText = 'button';
    outsideText = 'outside';
    contentText = 'content';
    modalRef = createRef();
  });

  describe('should work', () => {
    beforeEach(() => {
      const onClick = () => {
        const modal = modalRef.current;
        if (!modal) return;

        modal.showModal();
      };

      screen = render(
        <div style={{ width: '1920px', height: '1080px' }}>
          <span>{outsideText}</span>
          <span onClick={onClick}>{buttonText}</span>
          <Modal ref={modalRef}>
            <div>{contentText}</div>
          </Modal>
        </div>,
      );

      button = screen.getByText(buttonText);
      content = screen.getByText(contentText);
      outside = screen.getByText(outsideText);
    });

    it('should render', () => {
      expect(screen).toBeDefined();
    });

    it('should open modal', () => {
      fireEvent.click(button);
      expect(showModalFunc).toBeCalled();
    });

    describe('should close modal when', () => {
      it('close button', () => {
        const close = screen.getByText('x');
        fireEvent.click(button);
        fireEvent.click(close);
        expect(closeFunc).toBeCalled();
      });

      it('outside modal', () => {
        const modal = modalRef.current as HTMLDialogElement;
        const event = createEvent.click(modal, { clientX: 10, clientY: 10 });
        fireEvent.click(button);
        fireEvent.click(modal, event);
        expect(closeFunc).toBeCalled();
      });
    });
  });

  describe('should not work when', () => {
    it('ref is null', () => {
      const onClick = () => {
        const modal = modalRef.current;
        if (!modal) return;

        modal.showModal();
      };

      const nullScreen = render(
        <div style={{ width: '1920px', height: '1080px' }}>
          <span>{outsideText}</span>
          <span onClick={onClick}>{buttonText}</span>
          <Modal ref={null}>
            <div>{contentText}</div>
          </Modal>
        </div>,
      );

      button = nullScreen.getByText(buttonText);
      content = nullScreen.getByText(contentText);
      outside = nullScreen.getByText(outsideText);
      const close = nullScreen.getByText('x');

      fireEvent.click(button);
      expect(showModalFunc).not.toBeCalled();
      fireEvent.click(close);
      expect(closeFunc).not.toBeCalled();
    });
  });
});
