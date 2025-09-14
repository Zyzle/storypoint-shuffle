import { useEffect, useState } from 'react';

function useWindowCenter() {
  const [center, setCenter] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  useEffect(() => {
    function handleResize() {
      setCenter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return center;
}

export { useWindowCenter };
