import { createContext } from 'react';

import type { AppState } from '../types';

const SocketContext = createContext<AppState | undefined>(undefined);

export { SocketContext };
