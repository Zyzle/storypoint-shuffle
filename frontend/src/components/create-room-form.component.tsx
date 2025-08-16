import { useForm } from '@tanstack/react-form';
import { ArrowRight } from 'lucide-react';
import z from 'zod';

const createRoomSchema = z.object({
  name: z.string().min(3).max(100).trim().nonempty(),
});

function CreateRoomForm({ onCreate }: { onCreate: (name: string) => void }) {
  const createForm = useForm({
    defaultValues: {
      name: '',
    },
    onSubmit: (values) => {
      onCreate(values.value.name);
    },
    validators: {
      onChange: createRoomSchema,
    },
  });

  return (
    <div className="card w-lg p-6 space-y-4 shadow-lg bg-surface-100-900">
      <h2 className="h3">Create a Room</h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          createForm.handleSubmit();
        }}
      >
        <createForm.Field
          name="name"
          children={(field) => (
            <label className="label">
              <span className="label-text">Name</span>
              <input
                type="text"
                className="input"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </label>
          )}
        />
        <createForm.Subscribe
          selector={(state) => [state.canSubmit, state.isPristine]}
          children={([canSubmit, isPristine]) => (
            <button
              type="submit"
              className="btn preset-filled-primary-500"
              aria-disabled={!canSubmit || isPristine}
              disabled={!canSubmit || isPristine}
            >
              <span>Create Room</span>
              <ArrowRight size={18} />
            </button>
          )}
        />
      </form>
    </div>
  );
}

export { CreateRoomForm };
