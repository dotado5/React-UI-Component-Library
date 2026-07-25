import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { LoginForm } from '../fixtures/LoginForm';

// Integration: Input + Button composing a controlled form.
describe('Integration: Login form (Input + Button)', () => {
  it('updates field values as the user types', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);

    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');

    await user.type(email, 'jane@example.com');
    await user.type(password, 'supersecret');

    expect(email).toHaveValue('jane@example.com');
    expect(password).toHaveValue('supersecret');
  });

  it('passes the entered credentials to the submit handler', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'jane@example.com');
    await user.type(screen.getByLabelText('Password'), 'supersecret');
    await user.click(screen.getByRole('button', { name: 'Log in' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'jane@example.com',
      password: 'supersecret',
    });
  });

  it('propagates parent validation state down to the inputs', async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole('button', { name: 'Log in' }));

    // Parent-held error state renders on the child Input.
    const email = screen.getByLabelText('Email');
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
