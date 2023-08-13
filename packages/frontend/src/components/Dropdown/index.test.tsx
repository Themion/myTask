import { RenderResult, fireEvent, render } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import Dropdown from '.';

describe('Dropdown', () => {
  let screen: RenderResult;
  let outsideText: string;
  let buttonText: string;
  let contentText: string;
  let button: HTMLElement | null;
  let content: HTMLElement | null;
  let outside: HTMLElement | null;

  beforeEach(() => {
    outsideText = 'outside';
    buttonText = 'button';
    contentText = 'dropdown content';

    screen = render(
      <div>
        <span>{outsideText}</span>
        <Dropdown button={<button>{buttonText}</button>}>
          <div>{contentText}</div>
        </Dropdown>
      </div>,
    );

    button = screen.queryByText(buttonText);
    content = screen.queryByText(contentText);
    outside = screen.queryByText(outsideText);
  });

  it('should render', () => {
    expect(screen).toBeDefined();
  });

  describe('button', () => {
    it('should display', () => {
      expect(button).toBeDefined();
    });
  });

  describe('content', () => {
    describe('should not display when', () => {
      it('initial state', () => {
        expect(content).toBeNull();
      });

      it('clicked button even times', () => {
        fireEvent.click(button as HTMLElement);
        fireEvent.click(button as HTMLElement);
        expect(content).toBeNull();
      });

      it('clicked outside', () => {
        fireEvent.click(button as HTMLElement);
        fireEvent.click(outside as HTMLElement);
        expect(content).toBeNull();
      });
    });

    describe('should display when', () => {
      it('clicked button once', () => {
        fireEvent.click(button as HTMLElement);
        expect(content).toBeDefined();
      });

      it('clicked button odd times', () => {
        fireEvent.click(button as HTMLElement);
        fireEvent.click(button as HTMLElement);
        fireEvent.click(button as HTMLElement);
        expect(content).toBeDefined();
      });
    });
  });
});
