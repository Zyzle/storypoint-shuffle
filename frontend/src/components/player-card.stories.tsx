import type { Meta, StoryObj } from '@storybook/react-vite';

import { allModes } from '../../.storybook/modes';

import { PlayerCard } from './player-card.component';

const meta: Meta<typeof PlayerCard> = {
  title: 'Components/PlayerCard',
  component: PlayerCard,
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
  decorators: [
    (Story) => (
      <div className="md:relative w-full h-full flex flex-col md:items-center md:justify-center gap-2">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof PlayerCard>;

export const NoVote: Story = {
  args: {
    name: 'Player 1',
    isHost: false,
    hasVoted: false,
    isRevealed: false,
    isSpectator: false,
    classes: 'md:absolute',
    style: {
      top: '50px',
      left: '70px',
    },
    color: 'player-gradient-1',
  },
};

export const Host: Story = {
  args: {
    name: 'Player 1',
    isHost: true,
    hasVoted: false,
    isRevealed: false,
    isSpectator: false,
    color: 'player-gradient-1',
    classes: 'md:absolute',
    style: {
      top: '50px',
      left: '70px',
    },
  },
};

export const HasVoted: Story = {
  args: {
    name: 'Player 1',
    isHost: false,
    hasVoted: true,
    isRevealed: false,
    isSpectator: false,
    color: 'player-gradient-1',
    classes: 'md:absolute',
    style: {
      top: '50px',
      left: '70px',
    },
  },
};

export const Revealed: Story = {
  args: {
    name: 'Player 1',
    isHost: false,
    hasVoted: false,
    isRevealed: true,
    isSpectator: false,
    color: 'player-gradient-1',
    classes: 'md:absolute',
    style: {
      top: '50px',
      left: '70px',
    },
    vote: '5',
  },
};

export const PlayerWithLongName: Story = {
  args: {
    name: 'Player with a really long name',
    isHost: false,
    hasVoted: true,
    isRevealed: false,
    isSpectator: false,
    color: 'player-gradient-1',
    classes: 'md:absolute',
    style: {
      top: '50px',
      left: '70px',
    },
  },
};

export const IsSpectator: Story = {
  args: {
    name: 'Player 1',
    isHost: false,
    hasVoted: true,
    isRevealed: false,
    isSpectator: true,
    color: 'player-gradient-1',
    classes: 'md:absolute',
    style: {
      top: '50px',
      left: '70px',
    },
  },
};
