import { Segment } from '@skeletonlabs/skeleton-react';
import { useForm } from '@tanstack/react-form';
import { ArrowRight, Binoculars, Gamepad2 } from 'lucide-react';
import { z } from 'zod';

const createRoomSchema = z.object({
  name: z.string().min(3).max(100).trim().nonempty(),
  playerType: z.enum(['player', 'spectator']),
});

function CreateRoomForm({
  onCreate,
}: {
  onCreate: (name: string, isSpectator: boolean) => void;
}) {
  const createForm = useForm({
    defaultValues: {
      name: '',
      playerType: 'player',
    },
    onSubmit: (values) => {
      onCreate(values.value.name, values.value.playerType === 'spectator');
    },
    validators: {
      onChange: createRoomSchema,
    },
  });

  return (
    <div className="card w-lg p-6 space-y-4 shadow-lg bg-surface-100-900">
      <h2 className="h3 text-shadow-lg">Create a Room</h2>
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
              <span className="label-text">Player name</span>
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
        <createForm.Field
          name="playerType"
          children={(field) => (
            <label className="label">
              <span className="label-text">Join as player or spectator</span>
              <Segment
                name={field.name}
                value={field.state.value}
                onValueChange={(e) => field.handleChange(e.value!)}
              >
                <Segment.Item value="player">
                  <label className="sr-only">Player</label>
                  <Gamepad2 />
                </Segment.Item>
                <Segment.Item value="spectator">
                  <label className="sr-only">Spectator</label>
                  <Binoculars />
                </Segment.Item>
              </Segment>
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
