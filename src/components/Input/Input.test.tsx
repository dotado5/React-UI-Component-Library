import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  describe('rendering', () => {
    it('renders an input', () => {
      render(<Input aria-label="bare" />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders and associates a label', () => {
      render(<Input label="Email" />);
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('renders a placeholder', () => {
      render(<Input label="Email" placeholder="you@example.com" />);
      expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    });

    it('uses a provided id', () => {
      render(<Input id="custom-id" label="Name" />);
      expect(screen.getByLabelText('Name')).toHaveAttribute('id', 'custom-id');
    });

    it('generates an id linking label and input when none is given', () => {
      render(<Input label="Auto" />);
      const input = screen.getByLabelText('Auto');
      expect(input.id).toBeTruthy();
    });
  });

  describe('helper & error text', () => {
    it('renders helper text linked via aria-describedby', () => {
      render(<Input label="Name" helperText="Your full name" />);
      const input = screen.getByLabelText('Name');
      const helper = screen.getByText('Your full name');
      expect(input.getAttribute('aria-describedby')).toBe(helper.id);
    });

    it('renders an error with role alert and marks the input invalid', () => {
      render(<Input label="Name" error="Name is required" />);
      const input = screen.getByLabelText('Name');
      const error = screen.getByRole('alert');
      expect(error).toHaveTextContent('Name is required');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input.getAttribute('aria-describedby')).toBe(error.id);
    });

    it('hides helper text when an error is present', () => {
      render(<Input label="Name" helperText="hint" error="bad" />);
      expect(screen.queryByText('hint')).not.toBeInTheDocument();
      expect(screen.getByText('bad')).toBeInTheDocument();
    });

    it('is not marked invalid without an error', () => {
      render(<Input label="Name" helperText="hint" />);
      expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-invalid');
    });

    it('preserves a caller-provided aria-describedby', () => {
      render(<Input label="Name" helperText="hint" aria-describedby="external" />);
      const describedBy = screen.getByLabelText('Name').getAttribute('aria-describedby');
      expect(describedBy).toContain('external');
    });
  });

  describe('states', () => {
    it('marks the input required and shows an indicator', () => {
      render(<Input label="Name" required />);
      const input = screen.getByRole('textbox');
      expect(input).toBeRequired();
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('can be disabled', () => {
      render(<Input label="Name" disabled />);
      expect(screen.getByLabelText('Name')).toBeDisabled();
    });
  });

  describe('controlled mode', () => {
    it('reflects the controlled value and fires onChange', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      function Controlled() {
        const [value, setValue] = useState('');
        return (
          <Input
            label="Name"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onChange(e.target.value);
            }}
          />
        );
      }

      render(<Controlled />);
      const input = screen.getByLabelText('Name');
      await user.type(input, 'abc');
      expect(input).toHaveValue('abc');
      expect(onChange).toHaveBeenCalledTimes(3);
      expect(onChange).toHaveBeenLastCalledWith('abc');
    });
  });

  describe('icons', () => {
    it('renders a prefix icon and pads the input', () => {
      render(<Input label="Search" prefixIcon={<span data-testid="prefix" />} />);
      expect(screen.getByTestId('prefix')).toBeInTheDocument();
      expect(screen.getByLabelText('Search').className).toContain('pl-10');
    });

    it('renders a suffix icon and pads the input', () => {
      render(<Input label="Amount" suffixIcon={<span data-testid="suffix" />} />);
      expect(screen.getByTestId('suffix')).toBeInTheDocument();
      expect(screen.getByLabelText('Amount').className).toContain('pr-10');
    });
  });

  describe('password toggle', () => {
    it('shows a toggle for password inputs and switches visibility', async () => {
      const user = userEvent.setup();
      render(<Input label="Password" type="password" />);
      const input = screen.getByLabelText('Password');
      expect(input).toHaveAttribute('type', 'password');

      const toggle = screen.getByRole('button', { name: 'Show password' });
      expect(toggle).toHaveAttribute('aria-pressed', 'false');

      await user.click(toggle);
      expect(input).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );

      await user.click(screen.getByRole('button', { name: 'Hide password' }));
      expect(input).toHaveAttribute('type', 'password');
    });

    it('does not render a toggle for non-password inputs', () => {
      render(<Input label="Name" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('can be disabled via showPasswordToggle=false', () => {
      render(<Input label="Password" type="password" showPasswordToggle={false} />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('can be enabled explicitly on a non-password input', () => {
      render(<Input label="Code" showPasswordToggle />);
      expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });

    it('takes precedence over a suffix icon', () => {
      render(
        <Input label="Password" type="password" suffixIcon={<span data-testid="suffix" />} />,
      );
      expect(screen.queryByTestId('suffix')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
    });

    it('removes the toggle from the tab order when disabled', () => {
      render(<Input label="Password" type="password" disabled />);
      expect(screen.getByRole('button', { name: 'Show password' })).toHaveAttribute(
        'tabindex',
        '-1',
      );
    });
  });

  describe('props & ref', () => {
    it('forwards the ref to the underlying input element', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Input label="Name" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('spreads native input props', () => {
      render(<Input label="Name" name="fullname" maxLength={10} data-testid="native" />);
      const input = screen.getByTestId('native');
      expect(input).toHaveAttribute('name', 'fullname');
      expect(input).toHaveAttribute('maxlength', '10');
    });

    it('merges a custom className onto the input', () => {
      render(<Input label="Name" className="custom" />);
      expect(screen.getByLabelText('Name')).toHaveClass('custom');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations with a label and helper text', async () => {
      const { container } = render(<Input label="Email" helperText="We never share it" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations in the error state', async () => {
      const { container } = render(<Input label="Email" error="Invalid email" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations for a password input', async () => {
      const { container } = render(<Input label="Password" type="password" />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
