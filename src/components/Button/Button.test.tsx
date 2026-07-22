import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';
import type { ButtonSize, ButtonVariant } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders its children', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('renders as a native button with type="button" by default', () => {
      render(<Button>Go</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('renders left and right icons', () => {
      render(
        <Button leftIcon={<span data-testid="left" />} rightIcon={<span data-testid="right" />}>
          Labelled
        </Button>,
      );
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByTestId('right')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    const variants: ButtonVariant[] = ['primary', 'secondary', 'danger', 'outline', 'ghost'];
    it.each(variants)('applies the %s variant classes', (variant) => {
      render(<Button variant={variant}>V</Button>);
      const btn = screen.getByRole('button');
      const expected: Record<ButtonVariant, string> = {
        primary: 'bg-rgt-primary',
        secondary: 'bg-rgt-secondary',
        danger: 'bg-rgt-danger',
        outline: 'border-rgt-border',
        ghost: 'text-rgt-fg',
      };
      expect(btn.className).toContain(expected[variant]);
    });

    it('defaults to the primary variant', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button').className).toContain('bg-rgt-primary');
    });
  });

  describe('sizes', () => {
    const sizes: Record<ButtonSize, string> = { sm: 'h-8', md: 'h-10', lg: 'h-12' };
    it.each(Object.entries(sizes))('applies the %s size classes', (size, cls) => {
      render(<Button size={size as ButtonSize}>S</Button>);
      expect(screen.getByRole('button').className).toContain(cls);
    });

    it('defaults to the md size', () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole('button').className).toContain('h-10');
    });
  });

  describe('state', () => {
    it('is disabled when disabled is set', () => {
      render(<Button disabled>Nope</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows a spinner, accessible label and aria-busy while loading', () => {
      render(<Button isLoading>Saving</Button>);
      const btn = screen.getByRole('button');
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByTestId('button-spinner')).toBeInTheDocument();
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('supports a custom loading label', () => {
      render(
        <Button isLoading loadingLabel="Submitting form">
          Save
        </Button>,
      );
      expect(screen.getByText('Submitting form')).toBeInTheDocument();
    });

    it('hides icons while loading', () => {
      render(
        <Button isLoading leftIcon={<span data-testid="left" />} rightIcon={<span data-testid="right" />}>
          Save
        </Button>,
      );
      expect(screen.queryByTestId('left')).not.toBeInTheDocument();
      expect(screen.queryByTestId('right')).not.toBeInTheDocument();
    });

    it('does not set aria-busy when not loading', () => {
      render(<Button>Idle</Button>);
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
    });
  });

  describe('styling', () => {
    it('applies fullWidth class when set', () => {
      render(<Button fullWidth>Wide</Button>);
      expect(screen.getByRole('button').className).toContain('w-full');
    });

    it('does not apply fullWidth class by default', () => {
      render(<Button>Narrow</Button>);
      expect(screen.getByRole('button').className).not.toContain('w-full');
    });

    it('merges a custom className', () => {
      render(<Button className="custom-class">Styled</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });
  });

  describe('interaction', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={onClick}>Press</Button>);
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Button disabled onClick={onClick}>
          Press
        </Button>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not call onClick while loading', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Button isLoading onClick={onClick}>
          Press
        </Button>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });

    it('is activatable by keyboard', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(<Button onClick={onClick}>Key</Button>);
      screen.getByRole('button').focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('props & ref', () => {
    it('forwards the ref to the underlying button element', () => {
      const ref = createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Ref</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('spreads native button props', () => {
      render(
        <Button type="submit" aria-label="submit form" data-analytics="cta">
          Submit
        </Button>,
      );
      const btn = screen.getByRole('button', { name: 'submit form' });
      expect(btn).toHaveAttribute('type', 'submit');
      expect(btn).toHaveAttribute('data-analytics', 'cta');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Button>Accessible</Button>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations while loading', async () => {
      const { container } = render(<Button isLoading>Accessible</Button>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
