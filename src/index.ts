// Ships the precompiled stylesheet as a side effect of the library build.
// Consumers still import it explicitly via `@dotado/cobalt-ui/styles.css`.
import './styles/index.css';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { Checkbox } from './components/Checkbox';
export type { CheckboxProps } from './components/Checkbox';

export { RadioGroup } from './components/RadioGroup';
export type { RadioGroupProps, RadioOption } from './components/RadioGroup';

export { Switch } from './components/Switch';
export type { SwitchProps } from './components/Switch';

export { Badge } from './components/Badge';
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge';

export { Spinner } from './components/Spinner';
export type { SpinnerProps, SpinnerVariant, SpinnerSize } from './components/Spinner';

export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';

export { Card } from './components/Card';
export type { CardProps, CardShadow } from './components/Card';

export { useFocusTrap, useScrollLock, useControllableState, getFocusableElements } from './hooks';
