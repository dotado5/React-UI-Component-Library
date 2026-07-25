import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { Badge } from './Badge';
import type { BadgeSize, BadgeVariant } from './Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders its children', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('spreads native span props', () => {
      render(<Badge data-testid="badge" title="tooltip">New</Badge>);
      expect(screen.getByTestId('badge')).toHaveAttribute('title', 'tooltip');
    });

    it('merges a custom className', () => {
      render(<Badge className="custom">New</Badge>);
      expect(screen.getByText('New')).toHaveClass('custom');
    });
  });

  describe('variants', () => {
    const variants: Record<BadgeVariant, string> = {
      neutral: 'bg-rgt-muted',
      primary: 'bg-rgt-primary-subtle',
      success: 'bg-rgt-success-subtle',
      warning: 'bg-rgt-warning-subtle',
      danger: 'bg-rgt-danger-subtle',
      info: 'bg-rgt-info-subtle',
    };

    it.each(Object.entries(variants))('applies the %s variant', (variant, cls) => {
      render(<Badge variant={variant as BadgeVariant}>Label</Badge>);
      expect(screen.getByText('Label').className).toContain(cls);
    });

    it('defaults to the neutral variant', () => {
      render(<Badge>Label</Badge>);
      expect(screen.getByText('Label').className).toContain('bg-rgt-muted');
    });
  });

  describe('sizes', () => {
    const sizes: Record<BadgeSize, string> = { sm: 'text-xs', md: 'text-xs', lg: 'text-sm' };

    it.each(Object.entries(sizes))('applies the %s size', (size, cls) => {
      render(<Badge size={size as BadgeSize}>Label</Badge>);
      expect(screen.getByText('Label').className).toContain(cls);
    });

    it('defaults to the md size', () => {
      render(<Badge>Label</Badge>);
      expect(screen.getByText('Label').className).toContain('px-2.5');
    });
  });

  describe('shape', () => {
    it('is not fully rounded by default', () => {
      render(<Badge>Label</Badge>);
      expect(screen.getByText('Label').className).toContain('rounded-rgt-sm');
    });

    it('applies a pill shape when rounded', () => {
      render(<Badge rounded>Label</Badge>);
      expect(screen.getByText('Label').className).toContain('rounded-full');
    });
  });

  describe('dot indicator', () => {
    it('is hidden by default', () => {
      render(<Badge>Label</Badge>);
      expect(screen.queryByTestId('badge-dot')).not.toBeInTheDocument();
    });

    it('renders a decorative dot when enabled', () => {
      render(<Badge dot>Active</Badge>);
      const dot = screen.getByTestId('badge-dot');
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('colours the dot to match the variant', () => {
      render(
        <Badge dot variant="success">
          Active
        </Badge>,
      );
      expect(screen.getByTestId('badge-dot').className).toContain('bg-rgt-success');
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Badge dot variant="success">Active</Badge>);
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
