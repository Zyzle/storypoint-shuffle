import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { allModes } from '../../.storybook/modes';

import { CentralCard } from './central-card.component';
import { CardSet } from '../types';

const meta: Meta<typeof CentralCard> = {
  title: 'Components/CentralCard',
  component: CentralCard,
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
  decorators: [
    (Story) => (
      <div className="md:relative w-full h-full flex flex-col md:items-center md:justify-center gap-2 overflow-y-scroll">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CentralCard>;

export const VotesHidden: Story = {
  args: {
    isRevealed: false,
    showHostControls: false,
    votes: [],
    hasSomeVoted: false,
    cardSet: CardSet.fibonacci,
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
    cardSet: CardSet.fibonacci,
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
    cardSet: CardSet.fibonacci,
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
    cardSet: CardSet.fibonacci,
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
    cardSet: CardSet.fibonacci,
    onVotesRevealed: fn(),
    onVotesReset: fn(),
  },
};

export const AllPlayersPass: Story = {
  args: {
    isRevealed: true,
    showHostControls: false,
    votes: [0, 0, 0],
    hasSomeVoted: true,

    cardSet: {
      '1': 1,
      '2': 2,
      '3': 3,
      '5': 5,
      '8': 8,
      '13': 13,
      '?': 0,
    },
  },
};
