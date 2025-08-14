import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlayerCard } from './player-card.component';

const meta: Meta<typeof PlayerCard> = {
  title: 'Components/PlayerCard',
  component: PlayerCard,
  argTypes: {
    color: {
      control: {
        type: 'select',
      },
      options: [
        'player-gradient-1',
        'player-gradient-2',
        'player-gradient-3',
        'player-gradient-4',
        'player-gradient-5',
        'player-gradient-6',
      ],
    },
  },
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
    color: 'player-gradient-1',
  },
};

export const Host: Story = {
  args: {
    name: 'Player 1',
    isHost: true,
    hasVoted: false,
    isRevealed: false,
    color: 'player-gradient-1',
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
    color: 'player-gradient-1',
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
    color: 'player-gradient-1',
    style: {
      top: '50px',
      left: '100px',
    },
    vote: 5,
  },
};
