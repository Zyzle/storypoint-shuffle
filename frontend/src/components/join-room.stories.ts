import type { Meta, StoryObj } from '@storybook/react-vite';

import { JoinRoom } from './join-room.component';

const meta = {
  title: 'Components/JoinRoom',
  component: JoinRoom,
} satisfies Meta<typeof JoinRoom>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DialogOpen: Story = {
  args: {
    open: true,
    submit: (name: string) => {
      console.log(`Joining room with name: ${name}`);
    },
  },
};
