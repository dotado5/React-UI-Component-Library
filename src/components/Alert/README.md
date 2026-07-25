# Alert

Contextual feedback message with an optional title, icon and dismiss button.

```tsx
import { Alert } from '@dotado/cobalt-ui';

<Alert variant="success" title="Saved">
  Your changes were saved.
</Alert>;
```

## Props

Extends `React.HTMLAttributes<HTMLDivElement>` (minus `title`, which is
repurposed as content).

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Colour scheme and default icon. |
| `title` | `string` | — | Bold heading above the content. |
| `children` | `ReactNode` | — | Alert body content. |
| `onDismiss` | `() => void` | — | When provided, renders a dismiss button calling this handler. |
| `dismissLabel` | `string` | `'Dismiss'` | Accessible label for the dismiss button. |
| `icon` | `ReactNode` | variant default | Custom icon, replacing the variant default. |
| `showIcon` | `boolean` | `true` | Render an icon at all. |
| `role` | `string` | see below | Overrides the automatic role. |

## Roles

The role is chosen from the variant so announcements match urgency:

| Variant | Default role |
|---|---|
| `error` | `alert` (assertive — interrupts) |
| `info`, `success`, `warning` | `status` (polite) |

Pass `role` explicitly to override.

## Examples

### Variants

```tsx
<Alert variant="info">Scheduled maintenance on Sunday.</Alert>
<Alert variant="success">Profile updated.</Alert>
<Alert variant="warning">Your trial ends in 3 days.</Alert>
<Alert variant="error">Could not save your changes.</Alert>
```

### With a title

```tsx
<Alert variant="warning" title="Trial ending">
  Upgrade to keep access to premium features.
</Alert>
```

### Dismissible

```tsx
const [visible, setVisible] = useState(true);

{visible && (
  <Alert variant="success" onDismiss={() => setVisible(false)}>
    Your changes were saved.
  </Alert>
)}
```

The component never hides itself — you control visibility, exactly like
[`Modal`](../Modal/README.md).

### Custom or hidden icon

```tsx
<Alert icon={<MyIcon />}>Custom icon</Alert>
<Alert showIcon={false}>No icon</Alert>
```

## Accessibility

- Errors are announced assertively (`role="alert"`), other variants politely
  (`role="status"`).
- Icons are decorative (`aria-hidden`) — meaning always comes from the text, not
  from colour or icon alone.
- The dismiss button is a real `<button>` with an accessible label.
- Foreground/background token pairs are chosen to meet contrast requirements.
- Verified with `axe` in the default and dismissible states.

> Alerts rendered conditionally after a user action are announced when inserted.
> For content that is present from page load, consider whether an alert is the
> right pattern at all.
