# Hooks

Reusable primitives powering the components, exported for building your own.

```tsx
import {
  useFocusTrap,
  useScrollLock,
  useControllableState,
  getFocusableElements,
} from 'cobalt-ui';
```

---

## `useFocusTrap(active, containerRef)`

Traps keyboard focus within a container while `active` is true.

| Param | Type | Description |
|---|---|---|
| `active` | `boolean` | Whether the trap is engaged. |
| `containerRef` | `RefObject<HTMLElement \| null>` | The element to trap focus within. |

Returns `void`.

**Behavior**

- On activation, moves focus to the first focusable element inside the container,
  falling back to the container itself.
- Wraps Tab at the last element and Shift+Tab at the first.
- On deactivation or unmount, restores focus to whatever was focused beforehand.

The container should be focusable so focus can land on it — give it `tabIndex={-1}`.

```tsx
function Drawer({ open, onClose, children }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(open, ref);

  if (!open) return null;
  return (
    <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

---

## `useScrollLock(active)`

Locks scrolling on `document.body` while `active` is true, restoring the previous
`overflow` value on deactivation or unmount.

| Param | Type | Description |
|---|---|---|
| `active` | `boolean` | Whether the scroll lock is engaged. |

Returns `void`.

```tsx
useScrollLock(isMenuOpen);
```

---

## `useControllableState({ value, defaultValue, onChange })`

Supports components that may be either controlled or uncontrolled.

| Option | Type | Description |
|---|---|---|
| `value` | `T \| undefined` | Controlled value. When `undefined`, state is held internally. |
| `defaultValue` | `T` | Initial value in uncontrolled mode. |
| `onChange` | `(value: T) => void` | Called whenever the value changes, in both modes. |

Returns `[state, setState]`. In controlled mode `setState` only notifies
`onChange` — the parent remains the source of truth.

```tsx
function Toggle({ value, defaultValue = false, onChange }) {
  const [on, setOn] = useControllableState({ value, defaultValue, onChange });
  return <button onClick={() => setOn(!on)}>{on ? 'On' : 'Off'}</button>;
}
```

---

## `getFocusableElements(container)`

Returns the tabbable elements within `container`, in DOM order.

| Param | Type | Description |
|---|---|---|
| `container` | `HTMLElement` | Element to search within. |

Returns `HTMLElement[]`.

Matches links with `href`, non-disabled `button` / `input` / `select` /
`textarea`, and anything with a `tabindex` other than `-1`.

```tsx
const [first] = getFocusableElements(panelRef.current!);
first?.focus();
```
