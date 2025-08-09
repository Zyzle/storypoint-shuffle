import { useForm } from '@tanstack/react-form';
import { ArrowRight } from 'lucide-react';

import { Dialog, DialogContent, DialogHeading } from './dialog.component';

function JoinRoom({
  open,
  submit,
}: {
  open: boolean;
  submit: (name: string) => void;
}) {
  const form = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: (values) => {
      submit(values.value.name);
    },
  });

  return (
    <Dialog open={open}>
      <DialogContent className="Dialog">
        <DialogHeading>Join room</DialogHeading>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            children={(field) => (
              <label className="label">
                <span className="label-text">Name</span>
                <input
                  name={field.name}
                  type="text"
                  className="input"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </label>
            )}
          />
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                className="btn preset-filled-primary-500"
                disabled={!canSubmit || isSubmitting}
              >
                <span>Join Room</span>
                <ArrowRight size={18} />
              </button>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { JoinRoom };
