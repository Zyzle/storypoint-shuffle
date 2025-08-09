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
    averageVote: 0,
    onVotesRevealed: () => {},
    onVotesReset: () => {},
  },
};

export const HiddenWithHostControls: Story = {
  args: {
    isRevealed: false,
    showHostControls: true,
    averageVote: 0,
    onVotesRevealed: () => {},
    onVotesReset: () => {},
  },
};

export const VotesRevealed: Story = {
  args: {
    isRevealed: true,
    showHostControls: false,
    averageVote: 5,
    onVotesRevealed: () => {},
    onVotesReset: () => {},
  },
};

export const RevealedWithHostControls: Story = {
  args: {
    isRevealed: true,
    showHostControls: true,
    averageVote: 5,
    onVotesRevealed: () => {},
    onVotesReset: () => {},
  },
};
