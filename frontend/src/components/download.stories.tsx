import type { Meta, StoryObj } from "@storybook/react-vite";

import { allModes } from "../../.storybook/modes";

import { Download as DownloadComponent } from "./download.component";
import { CardSet } from "../types";

const meta = {
  title: "Components/Download",
  component: DownloadComponent,
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
} satisfies Meta<typeof DownloadComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Download: Story = {
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
          vote: 5,
        },
        {
          name: "Ticket 3",
          description: "This is the third ticket.",
          vote: 2,
        },
        {
          name: "Ticket 4",
          description: "This is the fourth ticket.",
          vote: 3,
        },
      ],
    },
    cardSet: CardSet.Fibonacci,
  },
};
