import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('rendering', () => {
    it('renders a checkbox', () => {
      render(<Checkbox aria-label="bare" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders and associates a label', () => {
      render(<Checkbox label="Accept terms" />);
      expect(screen.getByLabelText('Accept terms')).toBeInTheDocument();
    });

    it('uses a provided id', () => {
      render(<Checkbox id="terms" label="Accept" />);
      expect(screen.getByLabelText('Accept')).toHaveAttribute('id', 'terms');
    });
  });

  describe('interaction', () => {
    it('toggles when clicked (uncontrolled)', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept" />);
      const box = screen.getByRole('checkbox');

      expect(box).not.toBeChecked();
      await user.click(box);
      expect(box).toBeChecked();
      await user.click(box);
      expect(box).not.toBeChecked();
    });

    it('toggles by clicking the label', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept" />);
      await user.click(screen.getByText('Accept'));
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('honours defaultChecked', () => {
      render(<Checkbox label="Accept" defaultChecked />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('does not toggle when disabled', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<Checkbox label="Accept" disabled onChange={onChange} />);
      const box = screen.getByRole('checkbox');

      await user.click(box);
      expect(box).not.toBeChecked();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('is toggleable with the keyboard', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept" />);
      const box = screen.getByRole('checkbox');
      box.focus();
      await user.keyboard(' ');
      expect(box).toBeChecked();
    });
  });

  describe('controlled mode', () => {
    it('reflects the controlled value and reports changes', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      function Controlled() {
        const [checked, setChecked] = useState(false);
        return (
          <Checkbox
            label="Accept"
            checked={checked}
            onChange={(e) => {
              setChecked(e.target.checked);
              onChange(e.target.checked);
            }}
          />
        );
      }

      render(<Controlled />);
      const box = screen.getByRole('checkbox');
      await user.click(box);
      expect(box).toBeChecked();
      expect(onChange).toHaveBeenCalledWith(true);
    });

    it('stays unchecked when a controlled value does not change', async () => {
      const user = userEvent.setup();
      render(<Checkbox label="Accept" checked={false} onChange={() => {}} />);
      const box = screen.getByRole('checkbox');
      await user.click(box);
      expect(box).not.toBeChecked();
    });
  });

  describe('indeterminate', () => {
    it('renders the mixed state', () => {
      render(<Checkbox label="All" indeterminate />);
      expect(screen.getByRole('checkbox')).toBePartiallyChecked();
    });

    it('is not indeterminate by default', () => {
      render(<Checkbox label="All" />);
      expect(screen.getByRole('checkbox')).not.toBePartiallyChecked();
    });

    it('clears the mixed state when toggled off', () => {
      const { rerender } = render(<Checkbox label="All" indeterminate />);
      expect(screen.getByRole('checkbox')).toBePartiallyChecked();
      rerender(<Checkbox label="All" indeterminate={false} />);
      expect(screen.getByRole('checkbox')).not.toBePartiallyChecked();
    });
  });

  describe('props & ref', () => {
    it('forwards the ref to the underlying input', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Checkbox label="Accept" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('spreads native input props', () => {
      render(<Checkbox label="Accept" name="terms" value="yes" data-testid="native" />);
      const box = screen.getByTestId('native');
      expect(box).toHaveAttribute('name', 'terms');
      expect(box).toHaveAttribute('value', 'yes');
    });

    it('merges custom classes', () => {
      render(<Checkbox label="Accept" className="custom" containerClassName="wrapper" />);
      expect(screen.getByRole('checkbox')).toHaveClass('custom');
      expect(document.querySelector('.wrapper')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Checkbox label="Accept terms" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations when indeterminate', async () => {
      const { container } = render(<Checkbox label="Select all" indeterminate />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
