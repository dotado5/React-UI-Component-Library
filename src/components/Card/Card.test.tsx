import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Card } from './Card';
import type { CardShadow } from './Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders its body children', () => {
      render(<Card>Body content</Card>);
      expect(screen.getByText('Body content')).toBeInTheDocument();
    });

    it('renders a header when provided', () => {
      render(<Card header="Card title">Body</Card>);
      expect(screen.getByText('Card title')).toBeInTheDocument();
    });

    it('renders a footer when provided', () => {
      render(<Card footer="Card footer">Body</Card>);
      expect(screen.getByText('Card footer')).toBeInTheDocument();
    });

    it('omits header and footer regions by default', () => {
      const { container } = render(<Card>Body</Card>);
      expect(container.querySelector('.border-b')).not.toBeInTheDocument();
      expect(container.querySelector('.border-t')).not.toBeInTheDocument();
    });

    it('merges custom classes', () => {
      const { container } = render(
        <Card className="custom" bodyClassName="body-custom">
          Body
        </Card>,
      );
      expect(container.firstElementChild).toHaveClass('custom');
      expect(container.querySelector('.body-custom')).toBeInTheDocument();
    });
  });

  describe('shadow', () => {
    const shadows: Record<CardShadow, string> = {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    };

    it.each(Object.entries(shadows))('applies the %s shadow', (shadow, cls) => {
      const { container } = render(<Card shadow={shadow as CardShadow}>Body</Card>);
      expect(container.firstElementChild?.className).toContain(cls);
    });

    it('defaults to the sm shadow', () => {
      const { container } = render(<Card>Body</Card>);
      expect(container.firstElementChild?.className).toContain('shadow-sm');
    });
  });

  describe('clickable state', () => {
    it('is not interactive by default', () => {
      render(<Card>Body</Card>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('exposes a button role and is focusable when clickable', () => {
      render(<Card clickable>Body</Card>);
      const card = screen.getByRole('button');
      expect(card).toHaveAttribute('tabindex', '0');
    });

    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Card clickable onClick={onClick}>
          Body
        </Card>,
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('activates with Enter and Space', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Card clickable onClick={onClick}>
          Body
        </Card>,
      );
      const card = screen.getByRole('button');
      card.focus();

      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('ignores other keys', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Card clickable onClick={onClick}>
          Body
        </Card>,
      );
      screen.getByRole('button').focus();
      await user.keyboard('a');
      expect(onClick).not.toHaveBeenCalled();
    });

    it('does not activate on keyboard when not clickable', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Card onClick={onClick} data-testid="card" tabIndex={0}>
          Body
        </Card>,
      );
      screen.getByTestId('card').focus();
      await user.keyboard('{Enter}');
      expect(onClick).not.toHaveBeenCalled();
    });

    it('still calls a caller-supplied onKeyDown', async () => {
      const onKeyDown = vi.fn();
      const user = userEvent.setup();
      render(
        <Card clickable onKeyDown={onKeyDown}>
          Body
        </Card>,
      );
      screen.getByRole('button').focus();
      await user.keyboard('a');
      expect(onKeyDown).toHaveBeenCalled();
    });
  });

  describe('props & ref', () => {
    it('forwards the ref to the underlying element', () => {
      const ref = createRef<HTMLDivElement>();
      render(<Card ref={ref}>Body</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('spreads native div props', () => {
      render(<Card data-testid="card">Body</Card>);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Card header="Title" footer="Footer">
          Body content
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it('has no axe violations when clickable', async () => {
      const { container } = render(
        <Card clickable onClick={() => {}}>
          Body content
        </Card>,
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});
