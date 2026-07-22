import { useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from './Modal';
import type { ModalProps } from './Modal';

function renderModal(props: Partial<ModalProps> = {}) {
  const onClose = vi.fn();
  const utils = render(
    <Modal isOpen onClose={onClose} title="Test dialog" {...props}>
      <p>Dialog body</p>
      <button type="button">Action</button>
    </Modal>,
  );
  return { onClose, ...utils };
}

// Harness with a real trigger, to exercise focus restoration on close.
function Harness(props: Partial<ModalProps> = {}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Test dialog" {...props}>
        <p>Dialog body</p>
      </Modal>
    </div>
  );
}

describe('Modal', () => {
  describe('rendering', () => {
    it('does not render when closed', () => {
      render(
        <Modal isOpen={false} onClose={() => {}} title="Hidden">
          <p>Body</p>
        </Modal>,
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders a dialog with aria-modal when open', () => {
      renderModal();
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('renders its children', () => {
      renderModal();
      expect(screen.getByText('Dialog body')).toBeInTheDocument();
    });

    it('labels the dialog with the title', () => {
      renderModal({ title: 'My title' });
      const dialog = screen.getByRole('dialog');
      const heading = screen.getByRole('heading', { name: 'My title' });
      expect(dialog).toHaveAttribute('aria-labelledby', heading.id);
    });

    it('falls back to aria-label when no title is given', () => {
      render(
        <Modal isOpen onClose={() => {}} aria-label="Unlabelled dialog">
          <p>Body</p>
        </Modal>,
      );
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-label', 'Unlabelled dialog');
      expect(dialog).not.toHaveAttribute('aria-labelledby');
    });

    it('renders into document.body via a portal', () => {
      const { container } = renderModal();
      expect(container).not.toContainElement(screen.getByRole('dialog'));
      expect(document.body).toContainElement(screen.getByRole('dialog'));
    });
  });

  describe('closing', () => {
    it('renders a close button that calls onClose', async () => {
      const user = userEvent.setup();
      const { onClose } = renderModal();
      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('can hide the close button', () => {
      renderModal({ showCloseButton: false });
      expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
    });

    it('closes on overlay click', async () => {
      const user = userEvent.setup();
      const { onClose } = renderModal();
      await user.click(screen.getByTestId('modal-overlay'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close when clicking inside the panel', async () => {
      const user = userEvent.setup();
      const { onClose } = renderModal();
      await user.click(screen.getByText('Dialog body'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('does not close on overlay click when disabled', async () => {
      const user = userEvent.setup();
      const { onClose } = renderModal({ closeOnOverlayClick: false });
      await user.click(screen.getByTestId('modal-overlay'));
      expect(onClose).not.toHaveBeenCalled();
    });

    it('closes on Escape', () => {
      const { onClose } = renderModal();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('does not close on Escape when disabled', () => {
      const { onClose } = renderModal({ closeOnEscape: false });
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('focus management', () => {
    it('moves focus into the dialog when opened', () => {
      renderModal();
      expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    });

    it('focuses the panel itself when there is nothing focusable inside', () => {
      render(
        <Modal isOpen onClose={() => {}} title="Empty" showCloseButton={false}>
          <p>No focusable controls here</p>
        </Modal>,
      );
      expect(screen.getByRole('dialog')).toHaveFocus();
    });

    it('wraps focus from the last element to the first on Tab', () => {
      renderModal();
      const dialog = screen.getByRole('dialog');
      const closeBtn = screen.getByRole('button', { name: 'Close' });
      const actionBtn = within(dialog).getByRole('button', { name: 'Action' });

      actionBtn.focus();
      fireEvent.keyDown(actionBtn, { key: 'Tab' });
      expect(closeBtn).toHaveFocus();
    });

    it('wraps focus from the first element to the last on Shift+Tab', () => {
      renderModal();
      const dialog = screen.getByRole('dialog');
      const closeBtn = screen.getByRole('button', { name: 'Close' });
      const actionBtn = within(dialog).getByRole('button', { name: 'Action' });

      closeBtn.focus();
      fireEvent.keyDown(closeBtn, { key: 'Tab', shiftKey: true });
      expect(actionBtn).toHaveFocus();
    });

    it('leaves focus alone for Tab in the middle of the list', () => {
      renderModal();
      const closeBtn = screen.getByRole('button', { name: 'Close' });
      closeBtn.focus();
      // Tab (no shift) while on the first element: browser handles it, no wrap.
      fireEvent.keyDown(closeBtn, { key: 'Tab' });
      expect(closeBtn).toHaveFocus();
    });

    it('ignores non-Tab keys in the trap', () => {
      renderModal();
      const closeBtn = screen.getByRole('button', { name: 'Close' });
      closeBtn.focus();
      fireEvent.keyDown(closeBtn, { key: 'a' });
      expect(closeBtn).toHaveFocus();
    });

    it('keeps focus on the panel when Tab is pressed with no focusable content', () => {
      render(
        <Modal isOpen onClose={() => {}} title="Empty" showCloseButton={false}>
          <p>Nothing focusable</p>
        </Modal>,
      );
      const dialog = screen.getByRole('dialog');
      fireEvent.keyDown(dialog, { key: 'Tab' });
      expect(dialog).toHaveFocus();
    });

    it('restores focus to the trigger when closed', async () => {
      const user = userEvent.setup();
      render(<Harness />);
      const openBtn = screen.getByRole('button', { name: 'Open' });

      await user.click(openBtn);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(openBtn).toHaveFocus();
    });
  });

  describe('body scroll lock', () => {
    it('locks body scroll while open and restores it on close', () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={() => {}} title="Scroll">
          <p>Body</p>
        </Modal>,
      );
      expect(document.body.style.overflow).toBe('');

      rerender(
        <Modal isOpen onClose={() => {}} title="Scroll">
          <p>Body</p>
        </Modal>,
      );
      expect(document.body.style.overflow).toBe('hidden');

      rerender(
        <Modal isOpen={false} onClose={() => {}} title="Scroll">
          <p>Body</p>
        </Modal>,
      );
      expect(document.body.style.overflow).toBe('');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      renderModal();
      expect(await axe(document.body)).toHaveNoViolations();
    });
  });
});
