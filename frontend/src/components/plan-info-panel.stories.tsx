import type { Meta, StoryObj } from "@storybook/react-vite";

import { allModes } from "../../.storybook/modes";

import { PlanInfoPanel as PlanInfoPanelComponent } from "./plan-info-panel.component";

const meta = {
  title: "Components/PlanInfoPanel",
  component: PlanInfoPanelComponent,
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
} satisfies Meta<typeof PlanInfoPanelComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlanInfoPanel: Story = {};
