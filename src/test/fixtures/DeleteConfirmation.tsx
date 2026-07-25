import { useState } from 'react';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';

export interface DeleteConfirmationProps {
  onConfirm: () => void;
  triggerLabel?: string;
}

/**
 * Composite fixture (Button + Modal) used by the integration and functional
 * test suites. A trigger opens a confirmation dialog; confirming runs the
 * callback and closes, cancelling just closes.
 */
export function DeleteConfirmation({
  onConfirm,
  triggerLabel = 'Delete',
}: DeleteConfirmationProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button variant="danger" onClick={() => setOpen(true)}>
        {triggerLabel}
      </Button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete item"
        aria-describedby="delete-confirmation-desc"
      >
        <p id="delete-confirmation-desc">This action cannot be undone.</p>
        <div>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}
