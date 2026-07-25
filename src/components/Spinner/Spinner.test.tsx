import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { Spinner } from './Spinner';
import type { SpinnerSize, SpinnerVariant } from './Spinner';

describe('Spinner', () => {
  describe('rendering', () => {
    it('exposes a status role', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders a decorative spinning icon', () => {
      render(<Spinner />);
      const icon = screen.getByTestId('spinner-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon.getAttribute('class')).toContain('animate-spin');
    });

    it('spreads native span props', () => {
      render(<Spinner data-testid="spin" />);
      expect(screen.getByTestId('spin')).toBeInTheDocument();
    });

    it('merges a custom className', () => {
      render(<Spinner className="custom" />);
      expect(screen.getByRole('status')).toHaveClass('custom');
    });
  });

  describe('accessible label', () => {
    it('announces "Loading" by default', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toHaveTextContent('Loading');
    });

    it('supports a custom label', () => {
      render(<Spinner label="Fetching results" />);
      expect(screen.getByText('Fetching results')).toBeInTheDocument();
    });
  });

  describe('sizes', () => {
    const sizes: Record<SpinnerSize, string> = { sm: 'h-4', md: 'h-6', lg: 'h-8' };

    it.each(Object.entries(sizes))('applies the %s size', (size, cls) => {
      render(<Spinner size={size as SpinnerSize} />);
      expect(screen.getByTestId('spinner-icon').getAttribute('class')).toContain(cls);
    });

    it('defaults to the md size', () => {
      render(<Spinner />);
      expect(screen.getByTestId('spinner-icon').getAttribute('class')).toContain('h-6');
    });
  });

  describe('variants', () => {
    const variants: Record<SpinnerVariant, string> = {
      primary: 'text-rgt-primary',
      secondary: 'text-rgt-secondary',
      danger: 'text-rgt-danger',
      current: 'text-current',
    };

    it.each(Object.entries(variants))('applies the %s variant', (variant, cls) => {
      render(<Spinner variant={variant as SpinnerVariant} />);
      expect(screen.getByTestId('spinner-icon').getAttribute('class')).toContain(cls);
    });

    it('defaults to the primary variant', () => {
      render(<Spinner />);
      expect(screen.getByTestId('spinner-icon').getAttribute('class')).toContain('text-rgt-primary');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Spinner />);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
