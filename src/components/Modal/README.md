# Modal

An accessible modal dialog rendered in a portal on `document.body`. Handles focus
trapping and restoration, body scroll locking, Escape-to-close and
overlay-click-to-close.

```tsx
import { Modal, Button } from '@dotado/cobalt-ui';

const [open, setOpen] = useState(false);

<>
  <Button onClick={() => setOpen(true)}>Open</Button>
  <Modal isOpen={open} onClose={() => setOpen(false)} title="Settings">
    <p>Modal content</p>
  </Modal>
</>;
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | `boolean` | — | **Required.** Whether the dialog is visible. |
| `onClose` | `() => void` | — | **Required.** Called when the dialog requests to close. |
| `children` | `ReactNode` | — | **Required.** Dialog body content. |
| `title` | `string` | — | Rendered as a heading and used for `aria-labelledby`. |
| `closeOnOverlayClick` | `boolean` | `true` | Close when the backdrop is clicked. |
| `closeOnEscape` | `boolean` | `true` | Close when Escape is pressed. |
| `showCloseButton` | `boolean` | `true` | Render the built-in × button. |
| `overlayClassName` | `string` | — | Class for the overlay/backdrop. |
| `className` | `string` | — | Class for the dialog panel. |
| `aria-label` | `string` | — | Accessible name, used when no `title` is given. |
| `aria-describedby` | `string` | — | Id of an element describing the dialog. |

`onClose` is called by the close button, the overlay (when enabled), and Escape
(when enabled) — the component never closes itself, so `isOpen` stays fully
controlled by you.

## Examples

### Confirmation dialog

```tsx
<Modal
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Delete item"
  aria-describedby="delete-desc"
>
  <p id="delete-desc">This action cannot be undone.</p>
  <Button variant="ghost" onClick={() => setOpen(false)}>
    Cancel
  </Button>
  <Button variant="danger" onClick={confirmDelete}>
    Delete
  </Button>
</Modal>
```

### Without a visible title

Provide `aria-label` so the dialog still has an accessible name:

```tsx
<Modal isOpen={open} onClose={close} aria-label="Image preview">
  <img src={src} alt="" />
</Modal>
```

### Non-dismissible

Force an explicit choice by disabling the casual dismiss paths:

```tsx
<Modal
  isOpen={open}
  onClose={close}
  title="Accept terms"
  closeOnOverlayClick={false}
  closeOnEscape={false}
  showCloseButton={false}
>
  ...
</Modal>
```

## Behavior

- **Portal** — rendered into `document.body`, so it escapes parent overflow and
  stacking contexts.
- **Focus trap** — on open, focus moves to the first focusable element inside the
  dialog (or the panel itself if there is none). Tab and Shift+Tab wrap at the
  boundaries.
- **Focus restore** — on close, focus returns to whatever was focused before the
  dialog opened (typically the trigger).
- **Scroll lock** — `document.body` overflow is hidden while open and restored on
  close.
- Renders nothing when `isOpen` is `false`.

## Accessibility

- `role="dialog"` with `aria-modal="true"`.
- Named by `aria-labelledby` (pointing at the `title` heading) or `aria-label`.
- The close button is labelled `"Close"`.
- The panel is focusable (`tabIndex={-1}`) so focus always lands inside.
- Verified with `axe`.

## Related hooks

The focus and scroll behavior is available standalone via
[`useFocusTrap` and `useScrollLock`](../../hooks/README.md).
