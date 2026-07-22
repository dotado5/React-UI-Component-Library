import { useState } from 'react';
import { Button } from '../src';
import type { ButtonVariant } from '../src';

const variants: ButtonVariant[] = ['primary', 'secondary', 'danger', 'outline', 'ghost'];

export function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  return (
    <main className="min-h-screen bg-rgt-bg text-rgt-fg p-8 max-w-3xl mx-auto flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">reactgentester</h1>
        <p className="text-rgt-secondary">Component showcase / demo playground.</p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Button — variants</h2>
        <div className="flex flex-wrap gap-3">
          {variants.map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Button — sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Button — states</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setCount((c) => c + 1)}>Clicked {count} times</Button>
          <Button disabled>Disabled</Button>
          <Button
            isLoading={loading}
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 1500);
            }}
          >
            {loading ? 'Saving' : 'Click to load'}
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Button — full width</h2>
        <Button fullWidth variant="primary">
          Full width
        </Button>
      </section>
    </main>
  );
}
