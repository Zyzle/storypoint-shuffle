import type { Meta, StoryObj } from '@storybook/react-vite';

import { CentralCard } from './central-card.component';

const meta: Meta<typeof CentralCard> = {
  title: 'Components/CentralCard',
  component: CentralCard,
};

export default meta;

type Story = StoryObj<typeof CentralCard>;

export const VotesHidden: Story = {
  args: {
    isRevealed: false,
    showHostControls: false,
    votes: [],
    onVotesRevealed: () => {},
    onVotesReset: () => {},
  },
};

export const HiddenWithHostControls: Story = {
  args: {
    isRevealed: false,
    showHostControls: true,
    votes: [],
    onVotesRevealed: () => {},
    onVotesReset: () => {},
  },
};

export const VotesRevealed: Story = {
  args: {
    isRevealed: true,
    showHostControls: false,
    votes: [5, 3, 5, 5, 1, 5],
    onVotesRevealed: () => {},
    onVotesReset: () => {},
  },
};

export const RevealedWithHostControls: Story = {
  args: {
    isRevealed: true,
    showHostControls: true,
    votes: [5, 3, 5, 5, 1, 5],
    onVotesRevealed: () => {},
    onVotesReset: () => {},
  },
};
