import type { Meta, StoryObj } from '@storybook/react-vite';

import { allModes } from '../../.storybook/modes';

import { Logo as LogoComponent } from './logo.component';

const meta = {
  title: 'Components/Logo',
  component: LogoComponent,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
} satisfies Meta<typeof LogoComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Logo: Story = {
  args: {
    width: 500,
    height: 500,
  },
};
