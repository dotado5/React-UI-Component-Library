import '@testing-library/jest-dom/vitest';
import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';

// Register the axe accessibility matcher (expect(...).toHaveNoViolations()).
expect.extend(toHaveNoViolations);

// Unmount React trees between tests to keep them isolated.
afterEach(() => {
  cleanup();
});
