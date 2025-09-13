import { Segment } from '@skeletonlabs/skeleton-react';
import { useForm } from '@tanstack/react-form';
import { ArrowRight, Binoculars, Gamepad2, Shirt } from 'lucide-react';
import { z } from 'zod';

import { Fibonacci } from './fibonacci.component';

const createRoomSchema = z.object({
  name: z.string().min(3).max(100).trim().nonempty(),
  playerType: z.enum(['player', 'spectator']),
  cardSet: z.enum(['fibonacci', 'tshirt']),
});

function CreateRoomForm({
  onCreate,
}: {
  onCreate: (name: string, isSpectator: boolean, cardSet: string) => void;
}) {
  const createForm = useForm({
    defaultValues: {
      name: '',
      playerType: 'player',
      cardSet: 'fibonacci',
    },
    onSubmit: (values) => {
      onCreate(
        values.value.name,
        values.value.playerType === 'spectator',
        values.value.cardSet,
      );
    },
    validators: {
      onChange: createRoomSchema,
    },
  });

  return (
    <div className="card w-sm md:w-lg p-6 space-y-4 shadow-lg bg-surface-100-900">
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
        <div className="grid grid-cols-[1fr_auto_1fr] place-items-center">
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
          <span className="vr pr-12 border-l-2"></span>
          <createForm.Field
            name="cardSet"
            children={(field) => (
              <label className="label">
                <span className="label-text">Room card set</span>
                <Segment
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(e) => field.handleChange(e.value!)}
                >
                  <Segment.Item value="fibonacci">
                    <label className="sr-only">Fibonacci</label>
                    <Fibonacci />
                  </Segment.Item>
                  <Segment.Item value="tshirt">
                    <label className="sr-only">T-Shirt</label>
                    <Shirt />
                  </Segment.Item>
                </Segment>
              </label>
            )}
          />
        </div>
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
