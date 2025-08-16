import type { Meta, StoryObj } from '@storybook/react-vite';

import { allModes } from '../../.storybook/modes';

import { Agreement } from './agreement.component';

const meta: Meta<typeof Agreement> = {
  title: 'Components/Agreement',
  component: Agreement,
  parameters: {
    chromatic: {
      modes: {
        light: allModes.light,
        dark: allModes.dark,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Agreement>;

export const FullAgreement: Story = {
  args: {
    modeVotePct: 100,
  },
};

export const Above75: Story = {
  args: {
    modeVotePct: 80,
  },
};

export const Between50And75: Story = {
  args: {
    modeVotePct: 60,
  },
};

export const LessThan50: Story = {
  args: {
    modeVotePct: 40,
  },
};
