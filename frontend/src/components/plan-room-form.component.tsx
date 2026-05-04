import { SegmentedControl } from "@skeletonlabs/skeleton-react";
import { useForm } from "@tanstack/react-form";
import { ArrowRight, Binoculars, Gamepad2 } from "lucide-react";
import { z } from "zod";
import { RoomPlanFileUpload } from "./room-plan-file-upload.component";
import type { RoomPlan, RoomPlanFile } from "../types";
import { PlanInfoPanel } from "./plan-info-panel.component";

const planRoomSchema = z.object({
  name: z.string().min(3).max(100).trim().nonempty("Player name is required"),
  playerType: z.enum(["player", "spectator"], {
    message: 'Player type must be either "player" or "spectator"',
  }),
  roomPlan: z.object(
    {
      card_set: z.enum(["fibonacci", "t-shirt"]),
      tickets: z.array(z.object({ name: z.string(), description: z.string() })).nonempty(),
    },
    { message: 'Check the formatting of your "tickets" array' },
  ) satisfies z.ZodType<RoomPlanFile | null>,
});

function PlanRoomForm({
  onPlan,
}: {
  onPlan: (name: string, isSpectator: boolean, cardSet: string, roomPlan?: RoomPlan) => void;
}) {
  const defaultValues: {
    name: string;
    playerType: "player" | "spectator";
    roomPlan: RoomPlanFile | null;
  } = {
    name: "",
    playerType: "player",
    roomPlan: null,
  };

  const planForm = useForm({
    defaultValues,
    onSubmit: (values) => {
      if (!values.value.roomPlan) {
        return;
      }

      onPlan(
        values.value.name,
        values.value.playerType === "spectator",
        values.value.roomPlan.card_set,
        { tickets: values.value.roomPlan.tickets, current_ticket_index: 0 },
      );
    },
    validators: {
      onChange: planRoomSchema,
    },
  });

  return (
    <div className="card w-sm md:w-lg p-6 space-y-4 shadow-lg bg-surface-100-900">
      <h2 className="h3 text-shadow-lg flex items-center justify-between">
        Upload Room Plan <PlanInfoPanel />
      </h2>
      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          await planForm.handleSubmit();
        }}
      >
        <planForm.Field
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
          <planForm.Field
            name="playerType"
            children={(field) => (
              <div className="label">
                <span className="label-text">Join as player or spectator</span>
                <SegmentedControl
                  name={field.name}
                  value={field.state.value}
                  onValueChange={(e) => field.handleChange(e.value as "player" | "spectator")}
                >
                  <SegmentedControl.Control>
                    <SegmentedControl.Indicator />
                    <SegmentedControl.Item value="player" title="player" aria-label="player">
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
        </div>

        <planForm.Field
          name="roomPlan"
          children={(field) => <RoomPlanFileUpload onParsedPlan={field.handleChange} />}
        />

        <planForm.Subscribe
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

export { PlanRoomForm };
