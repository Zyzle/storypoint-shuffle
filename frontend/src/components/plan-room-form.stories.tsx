import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { allModes } from "../../.storybook/modes";

import { PlanRoomForm as PlanRoomFormComponent } from "./plan-room-form.component";

const meta = {
  title: "Components/Forms/PlanRoomForm",
  component: PlanRoomFormComponent,
  tags: ["autodocs"],
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
} satisfies Meta<typeof PlanRoomFormComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlanRoomForm: Story = {
  args: {
    onPlan: fn(),
  },
};
