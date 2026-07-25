# Input

An accessible text input with label, helper/error text, optional icons and a
password visibility toggle. Forwards its ref and spreads native input props.

```tsx
import { Input } from 'cobalt-ui';

<Input label="Email" type="email" placeholder="you@example.com" />;
```

## Props

Extends `React.InputHTMLAttributes<HTMLInputElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Visible label, automatically associated with the input. |
| `helperText` | `string` | — | Hint below the input. Hidden when `error` is set. |
| `error` | `string` | — | Error message. Also marks the input invalid. |
| `prefixIcon` | `ReactNode` | — | Icon inside the input, before the text. |
| `suffixIcon` | `ReactNode` | — | Icon inside the input, after the text. Ignored when the password toggle is active. |
| `showPasswordToggle` | `boolean` | `true` for `type="password"`, else `false` | Renders a visibility toggle button. |
| `containerClassName` | `string` | — | Class for the outer wrapper. |
| `className` | `string` | — | Merged onto the `<input>` itself. |
| `id` | `string` | auto-generated | Used to link the label; generated with `useId` when omitted. |
| `required` | `boolean` | `false` | Sets the native `required` attribute and shows a `*` indicator. |
| `disabled` | `boolean` | `false` | Native disabled state. |

Ref is forwarded to the underlying `HTMLInputElement`.

## Examples

### Helper text

```tsx
<Input label="Email" type="email" helperText="We'll never share your address." />
```

### Error state

Setting `error` marks the input `aria-invalid`, links the message via
`aria-describedby`, and announces it with `role="alert"`. Helper text is hidden
while an error is present.

```tsx
<Input label="Email" error="Enter a valid email address." />
```

### Required

```tsx
<Input label="Full name" required />
```

The `*` indicator is decorative (`aria-hidden`) and sits outside the `<label>`,
so the input's accessible name remains exactly `"Full name"`. Requiredness is
conveyed to assistive tech by the native `required` attribute.

### Controlled

```tsx
const [email, setEmail] = useState('');

<Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />;
```

### Icons

```tsx
<Input label="Search" prefixIcon={<SearchIcon />} />
<Input label="Amount" suffixIcon={<span>USD</span>} />
```

### Password toggle

Password inputs get a visibility toggle automatically:

```tsx
<Input label="Password" type="password" />
```

Opt out, or opt in on another input type:

```tsx
<Input label="Password" type="password" showPasswordToggle={false} />
<Input label="Access code" showPasswordToggle />
```

The toggle is a real `<button>` labelled `"Show password"` / `"Hide password"`,
exposes `aria-pressed`, and is removed from the tab order when the input is
disabled. When active it occupies the trailing slot, so `suffixIcon` is ignored.

## Accessibility

- The label is associated via `htmlFor`/`id`; an id is generated when not supplied.
- Helper and error text are linked with `aria-describedby`; a caller-supplied
  `aria-describedby` is preserved and merged.
- Errors set `aria-invalid="true"` and are announced via `role="alert"`.
- The required indicator is excluded from the accessible name.
- Verified with `axe` in the default, error and password states.
