// Ships the precompiled stylesheet as a side effect of the library build.
// Consumers still import it explicitly via `reactgentester/styles.css`.
import './styles/index.css';

export { Button } from './components/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button';
