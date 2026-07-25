import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Alert } from './Alert';
import type { AlertVariant } from './Alert';

describe('Alert', () => {
  describe('rendering', () => {
    it('renders its children', () => {
      render(<Alert>Something happened</Alert>);
      expect(screen.getByText('Something happened')).toBeInTheDocument();
    });

    it('renders an optional title', () => {
      render(<Alert title="Heads up">Details here</Alert>);
      expect(screen.getByText('Heads up')).toBeInTheDocument();
      expect(screen.getByText('Details here')).toBeInTheDocument();
    });

    it('merges a custom className', () => {
      render(<Alert className="custom">Message</Alert>);
      expect(screen.getByRole('status')).toHaveClass('custom');
    });
  });

  describe('variants', () => {
    const variants: Record<AlertVariant, string> = {
      info: 'bg-rgt-info-subtle',
      success: 'bg-rgt-success-subtle',
      warning: 'bg-rgt-warning-subtle',
      error: 'bg-rgt-danger-subtle',
    };

    it.each(Object.entries(variants))('applies the %s variant', (variant, cls) => {
      const { container } = render(<Alert variant={variant as AlertVariant}>Message</Alert>);
      expect(container.firstElementChild?.className).toContain(cls);
    });

    it('defaults to the info variant', () => {
      const { container } = render(<Alert>Message</Alert>);
      expect(container.firstElementChild?.className).toContain('bg-rgt-info-subtle');
    });
  });

  describe('roles', () => {
    it('uses role="status" for non-error variants', () => {
      render(<Alert variant="success">Saved</Alert>);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('uses role="alert" for the error variant', () => {
      render(<Alert variant="error">Failed</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('allows the role to be overridden', () => {
      render(
        <Alert variant="error" role="status">
          Failed
        </Alert>,
      );
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('renders a decorative variant icon by default', () => {
      render(<Alert variant="success">Saved</Alert>);
      const icon = screen.getByTestId('alert-icon');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });

    it('can hide the icon', () => {
      render(<Alert showIcon={false}>Message</Alert>);
      expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
    });

    it('accepts a custom icon', () => {
      render(<Alert icon={<span data-testid="custom-icon" />}>Message</Alert>);
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
    });
  });

  describe('dismissing', () => {
    it('renders no dismiss button by default', () => {
      render(<Alert>Message</Alert>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('calls onDismiss when the dismiss button is clicked', async () => {
      const onDismiss = vi.fn();
      const user = userEvent.setup();
      render(<Alert onDismiss={onDismiss}>Message</Alert>);

      await user.click(screen.getByRole('button', { name: 'Dismiss' }));
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });

    it('supports a custom dismiss label', () => {
      render(
        <Alert onDismiss={() => {}} dismissLabel="Close notification">
          Message
        </Alert>,
      );
      expect(screen.getByRole('button', { name: 'Close notification' })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Alert variant="success" title="Saved">
          Your changes were saved.
        </Alert>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations when dismissible', async () => {
      const { container } = render(
        <Alert variant="error" onDismiss={() => {}}>
          Something went wrong.
        </Alert>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
