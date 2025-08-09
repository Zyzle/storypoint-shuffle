import { useContext, useMemo, useState } from 'react';

import {
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';

import type { DialogOptions } from '../types';
import { DialogContext } from '../contexts/dialog.context';

const useDialogContext = () => {
  const context = useContext(DialogContext);

  if (context === null) {
    throw new Error('Dialog components must be wrapped in <Dialog />');
  }

  return context;
};

function useDialog({
  initialOpen = false,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: DialogOptions = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const [labelId, setLabelId] = useState<string | undefined>();
  const [descriptionId, setDescriptionId] = useState<string | undefined>();

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({ open, onOpenChange: setOpen });

  const context = data.context;

  const click = useClick(context, {
    enabled: controlledOpen == null,
  });
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' });
  const role = useRole(context);
  const interactions = useInteractions([click, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    }),
    [
      open,
      setOpen,
      interactions,
      data,
      labelId,
      descriptionId,
      setLabelId,
      setDescriptionId,
    ],
  );
}

export { useDialog, useDialogContext };
