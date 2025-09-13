import { useLayoutEffect, useRef, useState } from 'react';

function useElementCenter() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  useLayoutEffect(() => {
    function updateCenter() {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setCenter({
          x: rect.width / 2,
          y: rect.height / 2,
        });
      }
    }
    updateCenter();
    window.addEventListener('resize', updateCenter);
    return () => window.removeEventListener('resize', updateCenter);
  }, []);

  return [ref, center] as const;
}

export { useElementCenter };
