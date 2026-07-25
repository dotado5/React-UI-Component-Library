import { createRef, useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  describe('rendering', () => {
    it('exposes the switch role', () => {
      render(<Switch aria-label="Notifications" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders and associates a label', () => {
      render(<Switch label="Notifications" />);
      expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
    });

    it('uses a provided id', () => {
      render(<Switch id="notify" label="Notifications" />);
      expect(screen.getByLabelText('Notifications')).toHaveAttribute('id', 'notify');
    });
  });

  describe('interaction', () => {
    it('toggles on and off when clicked', async () => {
      const user = userEvent.setup();
      render(<Switch label="Notifications" />);
      const toggle = screen.getByRole('switch');

      expect(toggle).not.toBeChecked();
      await user.click(toggle);
      expect(toggle).toBeChecked();
      await user.click(toggle);
      expect(toggle).not.toBeChecked();
    });

    it('toggles by clicking the label', async () => {
      const user = userEvent.setup();
      render(<Switch label="Notifications" />);
      await user.click(screen.getByText('Notifications'));
      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('honours defaultChecked', () => {
      render(<Switch label="Notifications" defaultChecked />);
      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('is toggleable with the keyboard (Space)', async () => {
      const user = userEvent.setup();
      render(<Switch label="Notifications" />);
      const toggle = screen.getByRole('switch');
      toggle.focus();
      expect(toggle).toHaveFocus();
      await user.keyboard(' ');
      expect(toggle).toBeChecked();
    });

    it('does not toggle when disabled', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch label="Notifications" disabled onChange={onChange} />);
      const toggle = screen.getByRole('switch');

      await user.click(toggle);
      expect(toggle).not.toBeChecked();
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('controlled mode', () => {
    it('reflects the controlled value and reports changes', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      function Controlled() {
        const [on, setOn] = useState(false);
        return (
          <Switch
            label="Notifications"
            checked={on}
            onChange={(e) => {
              setOn(e.target.checked);
              onChange(e.target.checked);
            }}
          />
        );
      }

      render(<Controlled />);
      const toggle = screen.getByRole('switch');
      await user.click(toggle);
      expect(toggle).toBeChecked();
      expect(onChange).toHaveBeenCalledWith(true);
    });
  });

  describe('props & ref', () => {
    it('forwards the ref to the underlying input', () => {
      const ref = createRef<HTMLInputElement>();
      render(<Switch label="Notifications" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('spreads native input props', () => {
      render(<Switch label="Notifications" name="notify" data-testid="native" />);
      expect(screen.getByTestId('native')).toHaveAttribute('name', 'notify');
    });

    it('merges custom classes', () => {
      render(<Switch label="Notifications" className="custom" containerClassName="wrapper" />);
      expect(screen.getByRole('switch')).toHaveClass('custom');
      expect(document.querySelector('.wrapper')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Switch label="Notifications" />);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations when checked and disabled', async () => {
      const { container } = render(
        <Switch label="Notifications" defaultChecked disabled />,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
