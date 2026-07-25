# Card

Surface container with optional header and footer regions.

```tsx
import { Card } from '@dotado/cobalt-ui';

<Card header="Account" footer={<Button>Save</Button>}>
  Card body content
</Card>;
```

## Props

Extends `React.HTMLAttributes<HTMLDivElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `header` | `ReactNode` | — | Content rendered above a divider. |
| `footer` | `ReactNode` | — | Content rendered below a divider. |
| `children` | `ReactNode` | — | Body content. |
| `shadow` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Drop shadow depth. |
| `clickable` | `boolean` | `false` | Makes the whole card activatable — see below. |
| `bodyClassName` | `string` | — | Class applied to the body wrapper. |
| `className` | `string` | — | Merged onto the card's outer element. |

Ref is forwarded to the underlying `HTMLDivElement`. Header and footer regions
are omitted entirely when their props are not supplied.

## Examples

### Body only

```tsx
<Card>Just some content.</Card>
```

### Header and footer

```tsx
<Card
  header="Payment method"
  footer={
    <div className="flex justify-end gap-2">
      <Button variant="ghost">Cancel</Button>
      <Button>Save</Button>
    </div>
  }
>
  <Input label="Card number" />
</Card>
```

### Shadow

```tsx
<Card shadow="none">Flat</Card>
<Card shadow="lg">Raised</Card>
```

### Clickable

```tsx
<Card clickable onClick={() => open(item.id)}>
  {item.name}
</Card>
```

When `clickable` is set the card gains hover and focus affordances, exposes
`role="button"`, becomes focusable (`tabIndex={0}`), and activates `onClick` on
**Enter** or **Space**.

> ⚠️ Avoid putting other interactive elements (buttons, links, inputs) inside a
> clickable card. Nesting controls inside a `role="button"` produces ambiguous
> semantics and traps keyboard users. Prefer a non-clickable card containing an
> explicit action, or make only the title a link.

## Accessibility

- A plain card is a non-semantic container, so it adds nothing to the a11y tree —
  structure your content with real headings and landmarks.
- A clickable card is exposed as a button, is reachable via Tab, shows a visible
  focus ring, and responds to Enter/Space like a native button.
- A caller-supplied `onKeyDown` still runs alongside the built-in key handling.
- Verified with `axe` in the default and clickable states.
