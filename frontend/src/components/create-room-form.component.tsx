import { SegmentedControl } from '@skeletonlabs/skeleton-react';
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
              <div className="label">
                <span className="label-text">Join as player or spectator</span>
                <SegmentedControl
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(e) => field.handleChange(e.value!)}
                >
                  <SegmentedControl.Control>
                    <SegmentedControl.Indicator />
                    <SegmentedControl.Item
                      value="player"
                      title="player"
                      aria-label="player"
                    >
                      <SegmentedControl.ItemHiddenInput />
                      <SegmentedControl.ItemText>
                        <Gamepad2 />
                      </SegmentedControl.ItemText>
                    </SegmentedControl.Item>
                    <SegmentedControl.Item
                      value="spectator"
                      title="spectator"
                      aria-label="spectator"
                    >
                      <SegmentedControl.ItemHiddenInput />
                      <SegmentedControl.ItemText>
                        <Binoculars />
                      </SegmentedControl.ItemText>
                    </SegmentedControl.Item>
                  </SegmentedControl.Control>
                </SegmentedControl>
              </div>
            )}
          />
          <span className="vr mx-6 border-l-2"></span>
          <createForm.Field
            name="cardSet"
            children={(field) => (
              <div className="label">
                <span className="label-text">Room card set</span>
                <SegmentedControl
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(e) => field.handleChange(e.value!)}
                >
                  <SegmentedControl.Control>
                    <SegmentedControl.Indicator />
                    <SegmentedControl.Item
                      value="fibonacci"
                      title="fibonacci"
                      aria-label="fibonacci"
                    >
                      <SegmentedControl.ItemHiddenInput />
                      <SegmentedControl.ItemText>
                        <Fibonacci />
                      </SegmentedControl.ItemText>
                    </SegmentedControl.Item>
                    <SegmentedControl.Item
                      value="tshirt"
                      title="tshirt"
                      aria-label="tshirt"
                    >
                      <SegmentedControl.ItemHiddenInput />
                      <SegmentedControl.ItemText>
                        <Shirt />
                      </SegmentedControl.ItemText>
                    </SegmentedControl.Item>
                  </SegmentedControl.Control>
                </SegmentedControl>
              </div>
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
