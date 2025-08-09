import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

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
    onVoteChange: (vote) => {
      console.log('Vote changed to:', vote);
    },
  },
};

export const VoteSelected: Story = {
  args: {
    selectedVote: 1,
  },
};

export const ControlledComponent: Story = {
  decorators: [
    (Story, args) => {
      const [selectedVote, setSelectedVote] = useState(1);
      return <Story args={{ selectedVote, onVoteChange: setSelectedVote }} />;
    },
  ],
};
