import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlayerCard } from './player-card.component';

const meta: Meta<typeof PlayerCard> = {
  title: 'Components/PlayerCard',
  component: PlayerCard,
};

export default meta;

type Story = StoryObj<typeof PlayerCard>;

export const NoVote: Story = {
  args: {
    name: 'Player 1',
    isHost: false,
    hasVoted: false,
    isRevealed: false,
    style: { top: '50px', left: '100px' },
  },
};

export const Host: Story = {
  args: {
    name: 'Player 1',
    isHost: true,
    hasVoted: false,
    isRevealed: false,

    style: {
      top: '50px',
      left: '100px',
    },
  },
};

export const HasVoted: Story = {
  args: {
    name: 'Player 1',
    isHost: false,
    hasVoted: true,
    isRevealed: false,

    style: {
      top: '50px',
      left: '100px',
    },
  },
};

export const Revealed: Story = {
  args: {
    name: 'Player 1',
    isHost: false,
    hasVoted: false,
    isRevealed: true,

    style: {
      top: '50px',
      left: '100px',
    },

    vote: 5,
  },
};
