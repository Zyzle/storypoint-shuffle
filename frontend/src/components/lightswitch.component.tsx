import { useEffect, useState } from 'react';

import { Switch } from '@skeletonlabs/skeleton-react';
import { Moon, Sun } from 'lucide-react';

function Lightswitch(props: { className?: string }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem('mode') || 'dark';
    setChecked(mode === 'light');
  }, []);

  const onCheckedChanged = (event: { checked: boolean }) => {
    const mode = event.checked ? 'light' : 'dark';
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('mode', mode);
    setChecked(event.checked);
  };

  return (
    <Switch
      className={`m-0 ${props.className}`}
      checked={checked}
      onCheckedChange={onCheckedChanged}
    >
      <Switch.Control>
        <Switch.Thumb>
          <Switch.Context>
            {(checked) => (checked ? <Sun size="14" /> : <Moon size="14" />)}
          </Switch.Context>
        </Switch.Thumb>
      </Switch.Control>
      <span className="sr-only">Toggle light/dark mode</span>
      <Switch.HiddenInput />
    </Switch>
  );
}

export { Lightswitch };
