import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { allModes } from '../../.storybook/modes';

import { JoinRoomForm } from './join-room-form.component';

const meta = {
  title: 'Components/Forms/JoinRoomForm',
  component: JoinRoomForm,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
  async afterEach(context) {
    context.userEvent.clear(context.canvas.getByLabelText('Room ID'));
    context.userEvent.clear(context.canvas.getByLabelText('Player name'));
  },
} satisfies Meta<typeof JoinRoomForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    room: '',
    onJoin: fn(),
  },
  play: async ({ args, canvas, userEvent, step }) => {
    await step('Button disabled by default', async () => {
      expect(canvas.getByRole('button', { name: 'Join Room' })).toBeDisabled();
    });
    await step('Fill the form', async () => {
      await userEvent.type(
        canvas.getByLabelText('Room ID'),
        '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
      );
      await userEvent.type(canvas.getByLabelText('Player name'), 'Alice');
      await userEvent.click(canvas.getByText('Join Room'));
      await expect(args.onJoin).toHaveBeenCalledWith(
        '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
        'Alice',
      );
    });
  },
};

export const RoomPrePopulated: Story = {
  args: {
    room: '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
    onJoin: fn(),
  },
  play: async ({ args, canvas, userEvent, step }) => {
    await step('Button disabled by default', async () => {
      expect(canvas.getByLabelText('Room ID')).toBeDisabled();
      expect(canvas.getByLabelText('Room ID')).toHaveValue(
        '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
      );
      expect(canvas.getByRole('button', { name: 'Join Room' })).toBeDisabled();
    });
    await step('Fill the form', async () => {
      await userEvent.type(canvas.getByLabelText('Player name'), 'Alice');
      await userEvent.click(canvas.getByText('Join Room'));
      await expect(args.onJoin).toHaveBeenCalledWith(
        '07fcd101-ffbc-41b6-8284-20e5a1a3cacb',
        'Alice',
      );
    });
  },
};
