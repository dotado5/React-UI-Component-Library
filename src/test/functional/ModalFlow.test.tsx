import { useState } from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Modal } from '../../components/Modal';

function ModalHarness() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Dialog">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Modal>
    </div>
  );
}

// Functional: the full modal lifecycle a keyboard user experiences.
describe('Functional: Modal flow', () => {
  it('runs open → focus in → trap → escape → restore', async () => {
    const user = userEvent.setup();
    render(<ModalHarness />);
    const trigger = screen.getByRole('button', { name: 'Open dialog' });

    // Open the dialog.
    await user.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();

    // Focus moves inside the dialog (the close button is first focusable).
    const closeBtn = screen.getByRole('button', { name: 'Close' });
    expect(closeBtn).toHaveFocus();

    // Tab from the last focusable wraps back to the first.
    const second = within(dialog).getByRole('button', { name: 'Second' });
    second.focus();
    fireEvent.keyDown(second, { key: 'Tab' });
    expect(closeBtn).toHaveFocus();

    // Escape closes the dialog and restores focus to the trigger.
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
