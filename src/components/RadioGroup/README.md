# RadioGroup

An accessible group of radio buttons, rendered as a `<fieldset>`/`<legend>` so
assistive technology announces the group name.

```tsx
import { RadioGroup } from 'cobalt-ui';

<RadioGroup
  label="Size"
  options={[
    { label: 'Small', value: 'sm' },
    { label: 'Medium', value: 'md' },
    { label: 'Large', value: 'lg' },
  ]}
/>;
```

## Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `RadioOption[]` | — | **Required.** The selectable options. |
| `label` | `string` | — | Group label, rendered as a `<legend>`. |
| `name` | `string` | auto-generated | Shared `name` for the radios. |
| `value` | `string` | — | Controlled selected value. |
| `defaultValue` | `string` | `''` | Initial value in uncontrolled mode. |
| `onChange` | `(value: string) => void` | — | Called with the newly selected value. |
| `disabled` | `boolean` | `false` | Disables every option in the group. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction. |
| `className` | `string` | — | Class for the wrapping `<fieldset>`. |

### `RadioOption`

| Field | Type | Description |
|---|---|---|
| `label` | `string` | Visible label for the option. |
| `value` | `string` | Value reported when selected. |
| `disabled` | `boolean` | Disables this option only. |

Note that `onChange` receives the **value string**, not an event.

## Examples

### Uncontrolled

```tsx
<RadioGroup label="Plan" options={plans} defaultValue="pro" onChange={setPlan} />
```

### Controlled

```tsx
const [size, setSize] = useState('md');

<RadioGroup label="Size" options={sizes} value={size} onChange={setSize} />;
```

### Horizontal layout

```tsx
<RadioGroup label="Alignment" options={options} orientation="horizontal" />
```

### Disabled

Disable the whole group, or individual options:

```tsx
<RadioGroup label="Plan" options={plans} disabled />

<RadioGroup
  label="Plan"
  options={[
    { label: 'Free', value: 'free' },
    { label: 'Enterprise', value: 'ent', disabled: true },
  ]}
/>
```

## Accessibility

- Uses `<fieldset>` + `<legend>`, exposing a labelled `group` to assistive tech.
- Every option is a native radio sharing one `name`, so browsers provide arrow-key
  navigation and roving focus for free.
- Each option's label is associated via `htmlFor`/`id`, so clicking it selects.
- Group-level `disabled` uses the native `fieldset[disabled]` behavior.
- Verified with `axe`.
