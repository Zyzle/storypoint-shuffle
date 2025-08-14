import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { CardSelector } from './card-selector.component';

const meta: Meta<typeof CardSelector> = {
  title: 'Components/CardSelector',
  component: CardSelector,
};

export default meta;

type Story = StoryObj<typeof CardSelector>;

export const NoVote: Story = {
  args: {
    selectedVote: null,
    onVoteChange: fn(),
  },
};

export const VoteSelected: Story = {
  args: {
    selectedVote: 1,
    onVoteChange: fn(),
  },
};

export const ControlledComponent: Story = {
  decorators: [
    (Story) => {
      const [selectedVote, setSelectedVote] = useState(1);
      return <Story args={{ selectedVote, onVoteChange: setSelectedVote }} />;
    },
  ],
};
