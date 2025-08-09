import { Toaster } from '@skeletonlabs/skeleton-react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { RoomHeadline } from './room-headline.component';
import { toaster } from '../contexts/toaster.context';

const meta: Meta<typeof RoomHeadline> = {
  title: 'Components/RoomHeadline',
  component: RoomHeadline,
  decorators: [
    (Story) => (
      <>
        <Toaster toaster={toaster} />
        <Story />
      </>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RoomHeadline>;

export const NotHost: Story = {
  args: {
    roomId: '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
    isHost: false,
    playerName: 'Bob',
  },
};

export const IsHost: Story = {
  args: {
    roomId: '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
    isHost: true,
    playerName: 'Alice',
  },
};
