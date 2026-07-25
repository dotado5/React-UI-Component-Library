# Badge

Small status/label indicator. Purely presentational — renders a `<span>` and
spreads native span props.

```tsx
import { Badge } from '@dotado/cobalt-ui';

<Badge variant="success" dot rounded>Active</Badge>;
```

## Props

Extends `React.HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'neutral'` | Colour scheme. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size. |
| `rounded` | `boolean` | `false` | Use a fully rounded (pill) shape. |
| `dot` | `boolean` | `false` | Show a leading dot indicator. |
| `className` | `string` | — | Merged onto the span's classes. |

## Examples

### Variants

```tsx
<Badge>Neutral</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>
<Badge variant="info">Info</Badge>
```

### Sizes and shape

```tsx
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>

<Badge rounded>Pill</Badge>
```

### Dot indicator

The dot is decorative (`aria-hidden`) and takes its colour from the variant:

```tsx
<Badge dot variant="success">Online</Badge>
<Badge dot variant="danger">Offline</Badge>
```

## Accessibility

- The badge is plain text content, so its meaning comes from the text — the
  colour and dot are supplementary, never the only signal.
- The dot indicator is `aria-hidden`, so screen readers announce only the label.
- If a badge conveys state that isn't in its text, add an accessible label
  yourself (e.g. `aria-label`).
- Verified with `axe`.
