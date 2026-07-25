# Button

An accessible, themeable button. Renders a native `<button>`, forwards its ref,
and spreads all native button props.

```tsx
import { Button } from '@dotado/cobalt-ui';

<Button variant="primary" onClick={save}>
  Save changes
</Button>;
```

## Props

Extends `React.ButtonHTMLAttributes<HTMLButtonElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'outline' \| 'ghost'` | `'primary'` | Visual style. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size. |
| `isLoading` | `boolean` | `false` | Shows a spinner and prevents interaction. |
| `loadingLabel` | `string` | `'Loading'` | Accessible label announced while loading. |
| `leftIcon` | `ReactNode` | — | Icon rendered before the label. |
| `rightIcon` | `ReactNode` | — | Icon rendered after the label. |
| `fullWidth` | `boolean` | `false` | Stretches the button to fill its container. |
| `disabled` | `boolean` | `false` | Native disabled state. |
| `className` | `string` | — | Merged onto the button's classes. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Native type — defaults to `button` to avoid accidental form submits. |

Ref is forwarded to the underlying `HTMLButtonElement`.

## Examples

### Variants and sizes

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Loading state

While `isLoading`, the button is disabled, exposes `aria-busy="true"`, renders a
spinner, and announces `loadingLabel` to screen readers. Icons are hidden.

```tsx
<Button isLoading loadingLabel="Saving changes">
  Save
</Button>
```

### Icons

```tsx
<Button leftIcon={<PlusIcon />}>New item</Button>
<Button rightIcon={<ArrowRightIcon />}>Continue</Button>
```

Decorative icons should carry `aria-hidden="true"`.

### Full width

```tsx
<Button fullWidth>Continue</Button>
```

### Submitting a form

```tsx
<Button type="submit">Log in</Button>
```

## Accessibility

- Renders a native `<button>`, so it is focusable and keyboard-operable
  (Enter and Space) by default.
- Disabled and loading states both set the native `disabled` attribute, so click
  handlers do not fire.
- The loading state sets `aria-busy="true"` and exposes a visually hidden label.
- A visible focus ring is shown on keyboard focus (`focus-visible`).
- Verified with `axe` in both the default and loading states.
