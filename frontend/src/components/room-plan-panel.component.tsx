import { useState } from "react";
import { FloatingPanel, Portal } from "@skeletonlabs/skeleton-react";
import { GripVertical, MaximizeIcon, MinimizeIcon, MinusIcon, Timeline, XIcon } from "lucide-react";

import type { RoomPlan } from "../types";
import { Download } from "./download.component";

function RoomPlanPanel({
  roomPlan,
  cardSet,
}: {
  roomPlan: RoomPlan;
  cardSet: { [key: string]: number };
}) {
  const [size, setSize] = useState({ width: 400, height: 300 });

  return (
    <FloatingPanel
      minSize={{ width: 400, height: 300 }}
      size={size}
      onSizeChange={(details) => setSize(details.size)}
    >
      <FloatingPanel.Trigger
        className="btn-icon"
        aria-label="Open Room Plan"
        title="Open Room Plan"
      >
        <Timeline size={18} />
      </FloatingPanel.Trigger>
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content>
            <FloatingPanel.DragTrigger>
              <FloatingPanel.Header>
                <FloatingPanel.Title className="grid grid-cols-[auto_1fr_auto]">
                  <GripVertical className="size-4" />
                  Room Plan
                </FloatingPanel.Title>
                <FloatingPanel.Control>
                  <FloatingPanel.StageTrigger stage="minimized">
                    <MinusIcon className="size-4" />
                  </FloatingPanel.StageTrigger>
                  <FloatingPanel.StageTrigger stage="maximized">
                    <MaximizeIcon className="size-4" />
                  </FloatingPanel.StageTrigger>
                  <FloatingPanel.StageTrigger stage="default">
                    <MinimizeIcon className="size-4" />
                  </FloatingPanel.StageTrigger>
                  <FloatingPanel.CloseTrigger>
                    <XIcon className="size-4" />
                  </FloatingPanel.CloseTrigger>
                </FloatingPanel.Control>
              </FloatingPanel.Header>
            </FloatingPanel.DragTrigger>
            <FloatingPanel.Body className="p-1">
              {roomPlan.tickets.map((ticket, index) => (
                <div
                  key={index}
                  className={`card p-4 mb-2 grid grid-cols-[1fr_auto] ${index === roomPlan.current_ticket_index ? "preset-filled-primary-100-900" : "preset-tonal"}`}
                >
                  <div>
                    <h3 className="text-lg font-semibold">{ticket.name}</h3>
                    <p>{ticket.description}</p>
                  </div>
                  <div className="content-center text-xl">
                    {ticket.vote !== -1
                      ? Object.keys(cardSet).find((key) => cardSet[key] === ticket.vote)
                      : "--"}
                  </div>
                </div>
              ))}
              <div className="flex justify-center">
                <Download roomPlan={roomPlan} cardSet={cardSet} />
              </div>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTrigger axis="se" />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel>
  );
}

export { RoomPlanPanel };
