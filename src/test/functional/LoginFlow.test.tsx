import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../fixtures/LoginForm';

// Functional: the complete happy-path login workflow.
describe('Functional: Login flow', () => {
  it('lets a user enter credentials and log in successfully', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'user@site.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ email: 'user@site.com', password: 'password123' });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('supports submitting the form with the keyboard (Enter)', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'user@site.com');
    await user.type(screen.getByLabelText('Password'), 'password123{Enter}');

    expect(onSubmit).toHaveBeenCalledWith({ email: 'user@site.com', password: 'password123' });
  });
});
