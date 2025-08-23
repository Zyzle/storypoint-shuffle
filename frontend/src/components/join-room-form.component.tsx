import { Segment } from '@skeletonlabs/skeleton-react';
import { useForm } from '@tanstack/react-form';
import { ArrowRight, Binoculars, Gamepad2 } from 'lucide-react';
import { z } from 'zod';

const nameRoomSchema = z.object({
  name: z.string().min(3).max(100).trim().nonempty(),
  room: z.uuidv4().nonempty(),
  playerType: z.enum(['player', 'spectator']),
});

function JoinRoomForm({
  room,
  onJoin,
}: {
  room?: string;
  onJoin: (room: string, name: string, isSpectator: boolean) => void;
}) {
  const joinForm = useForm({
    defaultValues: {
      name: '',
      room: room ?? '',
      playerType: 'player',
    },
    onSubmit: (values) => {
      onJoin(
        values.value.room,
        values.value.name,
        values.value.playerType === 'spectator',
      );
    },
    validators: {
      onChange: nameRoomSchema,
    },
  });

  return (
    <div className="card w-lg p-6 space-y-4 shadow-lg bg-surface-100-900">
      <h2 className="h3 text-shadow-lg">Join a Room</h2>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          joinForm.handleSubmit();
        }}
      >
        <joinForm.Field
          name="room"
          children={(field) => (
            <label className="label">
              <span className="label-text">Room ID</span>
              <input
                disabled={!!room}
                className="input"
                type="text"
                name={field.name}
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </label>
          )}
        />
        <joinForm.Field
          name="name"
          children={(field) => (
            <label className="label">
              <span className="label-text">Player name</span>
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
        <joinForm.Field
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
        <joinForm.Subscribe
          selector={(state) => [state.canSubmit, state.isPristine]}
          children={([canSubmit, isPristine]) => (
            <button
              type="submit"
              className="btn preset-filled-primary-500"
              aria-disabled={!canSubmit || isPristine}
              disabled={!canSubmit || isPristine}
            >
              <span>Join Room</span>
              <ArrowRight size={18} />
            </button>
          )}
        />
      </form>
    </div>
  );
}

export { JoinRoomForm };
