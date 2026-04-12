import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { allModes } from '../../.storybook/modes';

import { CreateRoomForm as CreateRoomFormComponent } from './create-room-form.component';

const meta = {
  title: 'Components/Forms/CreateRoomForm',
  component: CreateRoomFormComponent,
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
  async afterEach(context) {
    context.userEvent.clear(context.canvas.getByLabelText('Player name'));
    context.userEvent.click(context.canvas.getByTitle('player'));
    context.userEvent.click(context.canvas.getByTitle('fibonacci'));
  },
} satisfies Meta<typeof CreateRoomFormComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CreateRoomForm: Story = {
  args: {
    onCreate: fn(),
  },
  play: async ({ args, canvas, userEvent, step }) => {
    await step('Click disabled by default', async () => {
      expect(
        canvas.getByRole('button', { name: 'Create Room' }),
      ).toBeDisabled();
    });
    await step('Fill in the form', async () => {
      await userEvent.type(canvas.getByLabelText('Player name'), 'Bob');
      await userEvent.click(canvas.getByText('Create Room'));
      await expect(args.onCreate).toHaveBeenCalledWith(
        'Bob',
        false,
        'fibonacci',
      );
    });
    await step('Test alternate options', async () => {
      await userEvent.clear(canvas.getByLabelText('Player name'));
      await userEvent.type(canvas.getByLabelText('Player name'), 'Alice');
      await userEvent.click(canvas.getByTitle('spectator'));
      await userEvent.click(canvas.getByTitle('tshirt'));
      await userEvent.click(canvas.getByText('Create Room'));
      await expect(args.onCreate).toHaveBeenCalledWith('Alice', true, 'tshirt');
    });
  },
};
