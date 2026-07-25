# Checkbox

An accessible checkbox built on a native `<input type="checkbox">`, so
controlled/uncontrolled behavior and form participation work natively.

```tsx
import { Checkbox } from 'cobalt-ui';

<Checkbox label="Accept terms" />;
```

## Props

Extends `React.InputHTMLAttributes<HTMLInputElement>` (minus `type`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Visible label, automatically associated with the input. |
| `indeterminate` | `boolean` | `false` | Renders the mixed state. Visual + assistive only — does not change `checked`. |
| `containerClassName` | `string` | — | Class for the outer wrapper. |
| `className` | `string` | — | Merged onto the `<input>` itself. |
| `id` | `string` | auto-generated | Links the label; generated with `useId` when omitted. |
| `checked` | `boolean` | — | Controlled checked state (pair with `onChange`). |
| `defaultChecked` | `boolean` | — | Initial state in uncontrolled mode. |
| `disabled` | `boolean` | `false` | Native disabled state. |

Ref is forwarded to the underlying `HTMLInputElement`.

## Examples

### Uncontrolled

```tsx
<Checkbox label="Remember me" defaultChecked />
```

### Controlled

```tsx
const [accepted, setAccepted] = useState(false);

<Checkbox
  label="Accept terms"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>;
```

### Indeterminate ("select all")

`indeterminate` is a DOM property rather than an attribute, so the component
applies it via a ref for you.

```tsx
<Checkbox
  label="Select all"
  indeterminate={someSelected && !allSelected}
  checked={allSelected}
  onChange={toggleAll}
/>
```

### Disabled

```tsx
<Checkbox label="Unavailable" disabled />
```

## Accessibility

- Renders a native checkbox, so it is focusable and toggleable with Space.
- The label is associated via `htmlFor`/`id`, so clicking it toggles the box.
- The indeterminate state is exposed as `mixed` to assistive technology.
- A visible focus ring is shown on keyboard focus (`focus-visible`).
- Verified with `axe` in the default and indeterminate states.
