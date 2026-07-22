// Ships the precompiled stylesheet as a side effect of the library build.
// Consumers still import it explicitly via `reactgentester/styles.css`.
import './styles/index.css';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';

export { Input } from './components/Input';
export type { InputProps } from './components/Input';

export { Modal } from './components/Modal';
export type { ModalProps } from './components/Modal';

export { useFocusTrap, useScrollLock, getFocusableElements } from './hooks';
