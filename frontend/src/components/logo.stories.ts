import type { Meta, StoryObj } from '@storybook/react-vite';

import { Logo } from './logo.component';

const meta = {
  title: 'Components/Logo',
  component: Logo,
} satisfies Meta<typeof Logo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 500,
    height: 500,
  },
};
