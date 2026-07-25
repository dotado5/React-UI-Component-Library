# Spinner

Indeterminate loading indicator. Exposes `role="status"` with a visually hidden
label so assistive technology announces the loading state.

```tsx
import { Spinner } from '@dotado/cobalt-ui';

<Spinner />;
```

## Props

Extends `React.HTMLAttributes<HTMLSpanElement>`.

| Prop | Type | Default | Description |
|---|---|---|---|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Spinner size. |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'current'` | `'primary'` | Colour scheme. `current` inherits the surrounding text colour. |
| `label` | `string` | `'Loading'` | Accessible label announced to screen readers. |
| `className` | `string` | — | Merged onto the wrapper span. |

## Examples

### Sizes

```tsx
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

### Variants

```tsx
<Spinner variant="primary" />
<Spinner variant="secondary" />
<Spinner variant="danger" />
```

Use `current` to inherit the surrounding text colour — handy inside coloured
containers:

```tsx
<div className="text-white">
  <Spinner variant="current" />
</div>
```

### Custom label

Describe what is loading so the announcement is meaningful:

```tsx
<Spinner label="Fetching results" />
```

### Loading region

```tsx
{isLoading ? <Spinner label="Loading orders" /> : <OrderTable orders={orders} />}
```

## Accessibility

- The wrapper has `role="status"`, so updates are announced politely.
- The SVG is `aria-hidden`; the accessible name comes from the visually hidden
  `label` text.
- Always give a descriptive `label` when the default "Loading" would be
  ambiguous — for example when several regions load at once.
- Verified with `axe`.

> For a button in its loading state, prefer [`Button`](../Button/README.md)'s
> built-in `isLoading` prop rather than composing a Spinner yourself.
