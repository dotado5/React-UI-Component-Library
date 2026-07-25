import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DeleteConfirmation } from '../fixtures/DeleteConfirmation';

// Integration: Button + Modal composing a confirmation flow.
describe('Integration: Delete confirmation (Button + Modal)', () => {
  it('opens the modal when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(<DeleteConfirmation onConfirm={() => {}} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on cancel without invoking the callback', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<DeleteConfirmation onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('runs the confirm callback and closes on confirm', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<DeleteConfirmation onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes via the modal close button without confirming', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<DeleteConfirmation onConfirm={onConfirm} />);

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
