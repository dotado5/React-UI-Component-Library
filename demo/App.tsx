import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Modal,
  RadioGroup,
  Spinner,
  Switch,
} from '../src';
import type { ButtonVariant } from '../src';

const variants: ButtonVariant[] = ['primary', 'secondary', 'danger', 'outline', 'ghost'];

export function App() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [size, setSize] = useState('md');
  const [alertVisible, setAlertVisible] = useState(true);

  return (
    <main className="min-h-screen bg-rgt-bg text-rgt-fg p-8 max-w-3xl mx-auto flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">cobalt-ui</h1>
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

      <section className="grid gap-4 sm:grid-cols-2">
        <h2 className="text-lg font-semibold sm:col-span-2">Input</h2>
        <Input label="Email" type="email" placeholder="you@example.com" helperText="We never share it." />
        <Input label="Full name" required placeholder="Jane Doe" />
        <Input label="Password" type="password" placeholder="••••••••" />
        <Input label="Username" error="That username is taken." defaultValue="taken" />
        <Input
          label="Search"
          placeholder="Search…"
          prefixIcon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          }
        />
        <Input label="Disabled" disabled placeholder="Unavailable" />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Badge</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success" dot>
            Active
          </Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger" dot>
            Failed
          </Badge>
          <Badge variant="info" rounded>
            Info pill
          </Badge>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Spinner</h2>
        <div className="flex flex-wrap items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner variant="secondary" />
          <Spinner variant="danger" label="Deleting" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Alert</h2>
        <Alert variant="info">Scheduled maintenance this Sunday.</Alert>
        <Alert variant="success" title="Saved">
          Your changes were saved successfully.
        </Alert>
        <Alert variant="warning" title="Trial ending">
          Your trial ends in 3 days.
        </Alert>
        <Alert variant="error">Could not save your changes.</Alert>
        {alertVisible && (
          <Alert variant="success" onDismiss={() => setAlertVisible(false)}>
            Dismissible — click the × to remove me.
          </Alert>
        )}
        {!alertVisible && (
          <Button size="sm" variant="outline" onClick={() => setAlertVisible(true)}>
            Bring back the dismissible alert
          </Button>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Card</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card header="Account settings" footer={<Button size="sm">Save</Button>}>
            <p className="text-rgt-secondary">Card with a header and footer region.</p>
          </Card>
          <Card shadow="lg">
            <p className="text-rgt-secondary">Body-only card with a large shadow.</p>
          </Card>
          <Card clickable onClick={() => alert('Card activated')}>
            <p className="font-medium">Clickable card</p>
            <p className="text-rgt-secondary">Activate with click, Enter or Space.</p>
          </Card>
          <Card shadow="none">
            <p className="text-rgt-secondary">Flat card, no shadow.</p>
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Checkbox</h2>
        <div className="flex flex-col gap-2">
          <Checkbox label="Accept terms and conditions" />
          <Checkbox label="Checked by default" defaultChecked />
          <Checkbox label="Select all (indeterminate)" indeterminate />
          <Checkbox label="Disabled" disabled />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Switch</h2>
        <div className="flex flex-col gap-3">
          <Switch label="Enable notifications" />
          <Switch label="On by default" defaultChecked />
          <Switch label="Disabled" disabled />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Radio group</h2>
        <RadioGroup
          label={`Size (selected: ${size})`}
          value={size}
          onChange={setSize}
          options={[
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
            { label: 'Unavailable', value: 'xl', disabled: true },
          ]}
        />
        <RadioGroup
          label="Horizontal"
          orientation="horizontal"
          defaultValue="a"
          options={[
            { label: 'Option A', value: 'a' },
            { label: 'Option B', value: 'b' },
          ]}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Modal</h2>
        <div>
          <Button variant="danger" onClick={() => setModalOpen(true)}>
            Delete account
          </Button>
        </div>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Delete account"
          aria-describedby="delete-desc"
        >
          <p id="delete-desc" className="text-rgt-secondary">
            This action is permanent and cannot be undone. Are you sure you want to delete your
            account?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setModalOpen(false)}>
              Delete
            </Button>
          </div>
        </Modal>
      </section>
    </main>
  );
}
