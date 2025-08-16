import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

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
    hasSomeVoted: false,
    onVotesRevealed: fn(),
    onVotesReset: fn(),
  },
};

export const HiddenWithHostControls: Story = {
  args: {
    isRevealed: false,
    showHostControls: true,
    votes: [],
    hasSomeVoted: false,
    onVotesRevealed: fn(),
    onVotesReset: fn(),
  },
};

export const HostControlsSomeVoted: Story = {
  args: {
    isRevealed: false,
    showHostControls: true,
    votes: [5],
    hasSomeVoted: true,
    onVotesRevealed: fn(),
    onVotesReset: fn(),
  },
};

export const VotesRevealed: Story = {
  args: {
    isRevealed: true,
    showHostControls: false,
    votes: [5, 3, 5, 5, 1, 5],
    hasSomeVoted: true,
    onVotesRevealed: fn(),
    onVotesReset: fn(),
  },
};

export const RevealedWithHostControls: Story = {
  args: {
    isRevealed: true,
    showHostControls: true,
    votes: [5, 3, 5, 5, 1, 5],
    hasSomeVoted: true,
    onVotesRevealed: fn(),
    onVotesReset: fn(),
  },
};
