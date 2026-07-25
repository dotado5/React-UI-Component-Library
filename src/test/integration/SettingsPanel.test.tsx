import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SettingsPanel } from '../fixtures/SettingsPanel';

// Integration: Card + Switch + Checkbox + Button sharing state.
describe('Integration: Settings panel (Card + Switch + Checkbox + Button)', () => {
  it('renders all controls inside the card', () => {
    render(<SettingsPanel onSave={() => {}} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Subscribe to newsletter' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('updates each control independently', async () => {
    const user = userEvent.setup();
    render(<SettingsPanel onSave={() => {}} />);

    const toggle = screen.getByRole('switch');
    const check = screen.getByRole('checkbox');

    await user.click(toggle);
    expect(toggle).toBeChecked();
    expect(check).not.toBeChecked();

    await user.click(check);
    expect(check).toBeChecked();
  });

  it('submits the latest values when saved', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<SettingsPanel onSave={onSave} />);

    await user.click(screen.getByRole('switch'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).toHaveBeenCalledWith({ notifications: true, newsletter: false });
  });

  it('reflects changes made after a previous save', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<SettingsPanel onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenLastCalledWith({ notifications: false, newsletter: false });

    await user.click(screen.getByRole('checkbox'));
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onSave).toHaveBeenLastCalledWith({ notifications: false, newsletter: true });
  });
});
