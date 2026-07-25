import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { LoginForm } from '../fixtures/LoginForm';

// Functional: keyboard-only usage and ARIA state updates.
describe('Functional: Accessibility flow', () => {
  it('walks the form in a logical tab order', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);

    const email = screen.getByLabelText('Email');
    const password = screen.getByLabelText('Password');
    const submit = screen.getByRole('button', { name: 'Log in' });

    await user.tab();
    expect(email).toHaveFocus();
    await user.tab();
    expect(password).toHaveFocus();
    await user.tab();
    expect(submit).toHaveFocus();
  });

  it('updates ARIA state and announces errors after a failed submit', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);

    const email = screen.getByLabelText('Email');
    expect(email).not.toHaveAttribute('aria-invalid');

    await user.click(screen.getByRole('button', { name: 'Log in' }));

    // Errors are exposed via role="alert" and the inputs are linked/invalid.
    expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email.getAttribute('aria-describedby')).toBeTruthy();
  });
});
