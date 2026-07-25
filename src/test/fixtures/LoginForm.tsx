import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

export interface LoginValues {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: (values: LoginValues) => void;
}

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Composite fixture (Input + Button) used by the integration and functional
 * test suites. Represents a realistic controlled, validated login form.
 */
export function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate(): boolean {
    const next: { email?: string; password?: string } = {};
    if (!email) next.email = 'Email is required';
    else if (!EMAIL_PATTERN.test(email)) next.email = 'Enter a valid email';
    if (!password) next.password = 'Password is required';
    else if (password.length < 8) next.password = 'Password must be at least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (validate()) onSubmit({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Log in">
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      <Input
        label="Password"
        type="password"
        showPasswordToggle={false}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />
      <Button type="submit">Log in</Button>
    </form>
  );
}
