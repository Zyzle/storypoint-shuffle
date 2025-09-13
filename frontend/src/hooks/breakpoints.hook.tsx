import { useEffect, useState } from 'react';

import { Breakpoints } from '../types';

function useBreakpoints() {
  const [breakpoint, setBreakpoint] = useState<Breakpoints>(Breakpoints.SM);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setBreakpoint(Breakpoints.SM);
      } else if (window.innerWidth < 768) {
        setBreakpoint(Breakpoints.MD);
      } else if (window.innerWidth < 1024) {
        setBreakpoint(Breakpoints.LG);
      } else {
        setBreakpoint(Breakpoints.XL);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return breakpoint;
}

export { useBreakpoints };
