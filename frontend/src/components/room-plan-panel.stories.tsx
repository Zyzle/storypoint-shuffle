import type { Meta, StoryObj } from "@storybook/react-vite";

import { allModes } from "../../.storybook/modes";

import { RoomPlanPanel as RoomPlanPanelComponent } from "./room-plan-panel.component";
import { CardSet } from "../types";

const meta = {
  title: "Components/RoomPlanPanel",
  component: RoomPlanPanelComponent,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
        mobile: allModes.mobile,
        tablet: allModes.tablet,
        desktop: allModes.desktop,
      },
    },
  },
} satisfies Meta<typeof RoomPlanPanelComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const RoomPlanPanel: Story = {
  args: {
    roomPlan: {
      current_ticket_index: 1,
      tickets: [
        {
          name: "Ticket 1",
          description: "This is the first ticket.",
          vote: 3,
        },
        {
          name: "Ticket 2",
          description: "This is the second ticket.",
        },
        {
          name: "Ticket 3",
          description: "This is the third ticket.",
        },
        {
          name: "Ticket 4",
          description: "This is the fourth ticket.",
        },
      ],
    },
    cardSet: CardSet.fibonacci,
  },
};
