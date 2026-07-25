import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { RadioGroup } from './RadioGroup';
import type { RadioOption } from './RadioGroup';

const options: RadioOption[] = [
  { label: 'Small', value: 'sm' },
  { label: 'Medium', value: 'md' },
  { label: 'Large', value: 'lg' },
];

describe('RadioGroup', () => {
  describe('rendering', () => {
    it('renders every option as a radio', () => {
      render(<RadioGroup label="Size" options={options} />);
      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('associates each option with its label', () => {
      render(<RadioGroup label="Size" options={options} />);
      expect(screen.getByLabelText('Small')).toBeInTheDocument();
      expect(screen.getByLabelText('Medium')).toBeInTheDocument();
      expect(screen.getByLabelText('Large')).toBeInTheDocument();
    });

    it('exposes a labelled group', () => {
      render(<RadioGroup label="Size" options={options} />);
      expect(screen.getByRole('group', { name: 'Size' })).toBeInTheDocument();
    });

    it('gives every radio the same name', () => {
      render(<RadioGroup label="Size" options={options} name="size" />);
      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).toHaveAttribute('name', 'size');
      }
    });

    it('generates a shared name when none is provided', () => {
      render(<RadioGroup label="Size" options={options} />);
      const names = screen.getAllByRole('radio').map((r) => r.getAttribute('name'));
      expect(new Set(names).size).toBe(1);
      expect(names[0]).toBeTruthy();
    });

    it('renders horizontally when asked', () => {
      const { container } = render(
        <RadioGroup label="Size" options={options} orientation="horizontal" />,
      );
      expect(container.querySelector('.flex-row')).toBeInTheDocument();
    });
  });

  describe('uncontrolled mode', () => {
    it('starts with nothing selected by default', () => {
      render(<RadioGroup label="Size" options={options} />);
      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).not.toBeChecked();
      }
    });

    it('honours defaultValue', () => {
      render(<RadioGroup label="Size" options={options} defaultValue="md" />);
      expect(screen.getByLabelText('Medium')).toBeChecked();
    });

    it('selects an option when clicked and reports the change', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(<RadioGroup label="Size" options={options} onChange={onChange} />);

      await user.click(screen.getByLabelText('Large'));

      expect(screen.getByLabelText('Large')).toBeChecked();
      expect(screen.getByLabelText('Small')).not.toBeChecked();
      expect(onChange).toHaveBeenCalledWith('lg');
    });
  });

  describe('controlled mode', () => {
    it('reflects the controlled value', () => {
      render(<RadioGroup label="Size" options={options} value="sm" onChange={() => {}} />);
      expect(screen.getByLabelText('Small')).toBeChecked();
    });

    it('does not change until the parent updates the value', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<RadioGroup label="Size" options={options} value="sm" onChange={onChange} />);

      await user.click(screen.getByLabelText('Large'));

      expect(onChange).toHaveBeenCalledWith('lg');
      expect(screen.getByLabelText('Small')).toBeChecked();
      expect(screen.getByLabelText('Large')).not.toBeChecked();
    });

    it('updates when the parent state changes', async () => {
      const user = userEvent.setup();

      function Controlled() {
        const [value, setValue] = useState('sm');
        return <RadioGroup label="Size" options={options} value={value} onChange={setValue} />;
      }

      render(<Controlled />);
      await user.click(screen.getByLabelText('Medium'));
      expect(screen.getByLabelText('Medium')).toBeChecked();
    });
  });

  describe('disabled state', () => {
    it('disables every option when the group is disabled', () => {
      render(<RadioGroup label="Size" options={options} disabled />);
      for (const radio of screen.getAllByRole('radio')) {
        expect(radio).toBeDisabled();
      }
    });

    it('disables individual options', () => {
      render(
        <RadioGroup
          label="Size"
          options={[...options.slice(0, 2), { label: 'Large', value: 'lg', disabled: true }]}
        />,
      );
      expect(screen.getByLabelText('Large')).toBeDisabled();
      expect(screen.getByLabelText('Small')).toBeEnabled();
    });

    it('does not select a disabled option', async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RadioGroup
          label="Size"
          options={[{ label: 'Small', value: 'sm', disabled: true }]}
          onChange={onChange}
        />,
      );

      await user.click(screen.getByLabelText('Small'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<RadioGroup label="Size" options={options} />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
