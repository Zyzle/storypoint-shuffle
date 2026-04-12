import { Toast } from '@skeletonlabs/skeleton-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { allModes } from '../../.storybook/modes';

import { RoomHeadline } from './room-headline.component';
import { toaster } from '../contexts/toaster.context';

const meta: Meta<typeof RoomHeadline> = {
  title: 'Components/RoomHeadline',
  component: RoomHeadline,
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
  decorators: [
    (Story) => (
      <>
        <Toast.Group toaster={toaster}>
          {(toast) => (
            <Toast toast={toast} key={toast.id}>
              <Toast.Message>
                <Toast.Title>{toast.title}</Toast.Title>
                <Toast.Description>{toast.description}</Toast.Description>
              </Toast.Message>
              <Toast.CloseTrigger />
            </Toast>
          )}
        </Toast.Group>
        <Story />
      </>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof RoomHeadline>;

export const IsPlayer: Story = {
  args: {
    roomId: '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
    isHost: false,
    isSpectator: false,
    playerName: 'Bob',
    exitRoom: fn(),
  },
};

export const IsHost: Story = {
  args: {
    roomId: '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
    isHost: true,
    isSpectator: false,
    playerName: 'Alice',
    exitRoom: fn(),
  },
};

export const EmptyRoomId: Story = {
  args: {
    roomId: '',
    isHost: true,
    isSpectator: false,
    playerName: 'Alice',
  },
};

export const IsSpectator: Story = {
  args: {
    roomId: '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
    isHost: false,
    isSpectator: true,
    playerName: 'Bob',
  },
};
