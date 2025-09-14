import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { allModes } from '../../.storybook/modes';

import { CardSelector } from './card-selector.component';
import { CardSet } from '../types';

const meta: Meta<typeof CardSelector> = {
  title: 'Components/CardSelector',
  component: CardSelector,
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
};

export default meta;

type Story = StoryObj<typeof CardSelector>;

export const NoVote: Story = {
  args: {
    selectedVote: null,
    cardSet: CardSet.fibonacci,
    onVoteChange: fn(),
  },
};

export const VoteSelected: Story = {
  args: {
    selectedVote: 1,
    cardSet: CardSet.fibonacci,
    onVoteChange: fn(),
  },
};

export const ControlledComponent: Story = {
  decorators: [
    (Story) => {
      const [selectedVote, setSelectedVote] = useState(1);
      return (
        <Story
          args={{
            selectedVote,
            cardSet: CardSet.fibonacci,
            onVoteChange: setSelectedVote,
          }}
        />
      );
    },
  ],
};
