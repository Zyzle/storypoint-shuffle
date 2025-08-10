import type { Preview } from '@storybook/react-vite';
import {
  withThemeByClassName,
  withThemeByDataAttribute,
} from '@storybook/addon-themes';

import '../index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export const decorators = [
  withThemeByClassName({
    themes: {
      light: 'light',
      dark: 'dark',
    },
    defaultTheme: 'dark',
  }),
  withThemeByDataAttribute({
    themes: {
      rocket: 'rocket',
    },
    defaultTheme: 'rocket',
    parentSelector: 'html',
    attributeName: 'data-theme',
  }),
];

export default preview;
