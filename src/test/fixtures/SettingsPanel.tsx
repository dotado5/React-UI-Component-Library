import { useState } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Checkbox } from '../../components/Checkbox';
import { Switch } from '../../components/Switch';

export interface SettingsValues {
  notifications: boolean;
  newsletter: boolean;
}

export interface SettingsPanelProps {
  onSave: (values: SettingsValues) => void;
}

/**
 * Composite fixture (Card + Switch + Checkbox + Button) used by the integration
 * test suite. Mirrors the "Settings Panel" scenario from the spec.
 */
export function SettingsPanel({ onSave }: SettingsPanelProps) {
  const [notifications, setNotifications] = useState(false);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <Card
      header="Settings"
      footer={
        <Button onClick={() => onSave({ notifications, newsletter })}>Save</Button>
      }
    >
      <Switch
        label="Enable notifications"
        checked={notifications}
        onChange={(e) => setNotifications(e.target.checked)}
      />
      <Checkbox
        label="Subscribe to newsletter"
        checked={newsletter}
        onChange={(e) => setNewsletter(e.target.checked)}
      />
    </Card>
  );
}
