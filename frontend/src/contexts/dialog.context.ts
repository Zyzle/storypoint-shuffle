import { createContext, type Dispatch, type SetStateAction } from 'react';

import type { useDialog } from '../hooks/dialog.hook';

type ContextType =
  | (ReturnType<typeof useDialog> & {
      setLabelId: Dispatch<SetStateAction<string | undefined>>;
      setDescriptionId: Dispatch<SetStateAction<string | undefined>>;
    })
  | null;

const DialogContext = createContext<ContextType>(null);

export { DialogContext };
