import { createContext } from 'react';

import type { useTooltip } from '../hooks/tooltip.hook';

type ContextType = ReturnType<typeof useTooltip> | null;

const TooltipContext = createContext<ContextType>(null);

export { TooltipContext };
