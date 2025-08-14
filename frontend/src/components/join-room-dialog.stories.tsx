import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { JoinRoomDialog as JoinRoomDialogComponent } from './join-room-dialog.component';

const meta = {
  title: 'Components/Dialogs/JoinRoomDialog',
  component: JoinRoomDialogComponent,
} satisfies Meta<typeof JoinRoomDialogComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JoinRoomDialog: Story = {
  args: {
    open: true,
    roomId: '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
    onJoin: fn(),
  },
  decorators: [
    (Story) => {
      return (
        <>
          <Story />
          <h1 className="h1">Some inaccessible background content</h1>
          <button className="btn preset-filled-primary-500" onClick={fn()}>
            Click me!
          </button>
        </>
      );
    },
  ],
};
