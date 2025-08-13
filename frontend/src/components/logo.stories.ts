import type { Meta, StoryObj } from '@storybook/react-vite';

import { Logo as LogoComponent } from './logo.component';

const meta = {
  title: 'Components/Logo',
  component: LogoComponent,
} satisfies Meta<typeof LogoComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Logo: Story = {
  args: {
    width: 500,
    height: 500,
  },
};
