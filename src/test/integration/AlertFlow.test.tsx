import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';

function AlertFlowHarness() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Button onClick={() => setVisible(true)}>Save changes</Button>
      {visible && (
        <Alert variant="success" title="Saved" onDismiss={() => setVisible(false)}>
          Your changes were saved.
        </Alert>
      )}
    </div>
  );
}

// Integration: Button + Alert.
describe('Integration: Alert flow (Button + Alert)', () => {
  it('shows no alert initially', () => {
    render(<AlertFlowHarness />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('displays the alert when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<AlertFlowHarness />);

    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    const alert = screen.getByRole('status');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Your changes were saved.');
  });

  it('removes the alert when dismissed', async () => {
    const user = userEvent.setup();
    render(<AlertFlowHarness />);

    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    expect(screen.getByRole('status')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('can be shown again after dismissal', async () => {
    const user = userEvent.setup();
    render(<AlertFlowHarness />);

    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
