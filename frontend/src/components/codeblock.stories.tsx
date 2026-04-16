import type { Meta, StoryObj } from "@storybook/react-vite";

import { allModes } from "../../.storybook/modes";

import { CodeBlock as CodeBlockComponent } from "./codeblock.component";

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlockComponent,
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
} satisfies Meta<typeof CodeBlockComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CodeBlock: Story = {
  args: {
    code: `{
	"name": "Alice",
	"age": 30
}`,
    lang: "json",
  },
};
