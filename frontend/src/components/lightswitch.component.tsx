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
      classes={props.className}
      checked={checked}
      onCheckedChange={onCheckedChanged}
      inactiveChild={<Moon size="14" />}
      activeChild={<Sun size="14" />}
    />
  );
}

export { Lightswitch };
