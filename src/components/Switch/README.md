# Switch

An accessible on/off switch. Built on a native checkbox with `role="switch"`, so
it is keyboard operable, participates in forms, and supports controlled and
uncontrolled usage natively.

```tsx
import { Switch } from '@dotado/cobalt-ui';

<Switch label="Enable notifications" />;
```

## Props

Extends `React.InputHTMLAttributes<HTMLInputElement>` (minus `type`).

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Visible label, automatically associated with the input. |
| `containerClassName` | `string` | — | Class for the outer wrapper. |
| `className` | `string` | — | Merged onto the `<input>` itself. |
| `id` | `string` | auto-generated | Links the label; generated with `useId` when omitted. |
| `checked` | `boolean` | — | Controlled on/off state (pair with `onChange`). |
| `defaultChecked` | `boolean` | — | Initial state in uncontrolled mode. |
| `disabled` | `boolean` | `false` | Native disabled state. |

Ref is forwarded to the underlying `HTMLInputElement`.

## Examples

### Uncontrolled

```tsx
<Switch label="Dark mode" defaultChecked />
```

### Controlled

```tsx
const [enabled, setEnabled] = useState(false);

<Switch
  label="Enable notifications"
  checked={enabled}
  onChange={(e) => setEnabled(e.target.checked)}
/>;
```

### Disabled

```tsx
<Switch label="Coming soon" disabled />
```

### In a form

Because it is a real checkbox input, it submits like one:

```tsx
<Switch label="Subscribe" name="subscribe" value="yes" />
```

## Accessibility

- Exposes `role="switch"`, so assistive tech announces "on"/"off" rather than
  "checked"/"unchecked".
- Keyboard operable with Space, and reachable via Tab.
- The label is associated via `htmlFor`/`id`, so clicking it toggles the switch.
- The focus ring is rendered on the visible track while the real input stays
  transparent above it, keeping hit area and focus behavior native.
- The track and thumb are `aria-hidden` decorations.
- Verified with `axe` in the default and checked+disabled states.

## Switch vs Checkbox

Use `Switch` for settings that take effect immediately (notifications, dark
mode). Use [`Checkbox`](../Checkbox/README.md) for values submitted with a form,
or when you need an indeterminate state.
