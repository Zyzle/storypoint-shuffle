import type { Preview } from '@storybook/react-vite';
import { DecoratorHelpers } from '@storybook/addon-themes';
import { useEffect as usePreviewEffect } from 'storybook/preview-api';

const { initializeThemeState, pluckThemeFromContext, useThemeParameters } =
  DecoratorHelpers;

import '../index.css';

// Based on a snippet provided by JonJamesDesign here https://github.com/storybookjs/storybook/discussions/25944#discussioncomment-10458288
const withThemeByDualDataAttributes = ({ themes, defaultTheme }) => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  return (storyFn, context) => {
    const { themeOverride } = useThemeParameters() ?? {};
    const selectedTheme = pluckThemeFromContext(context);

    usePreviewEffect(() => {
      const parentElement = document.querySelector('html');
      const themeKey = themeOverride || selectedTheme || defaultTheme;

      const [theme, mode] = themes[themeKey];

      if (parentElement) {
        parentElement.setAttribute('data-theme', theme);
        parentElement.setAttribute('data-mode', mode);
      }
    }, [themeOverride, selectedTheme]);

    return storyFn();
  };
};

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
    options: {
      storySort: (a, b) =>
        a.id === b.id
          ? 0
          : a.id.localeCompare(b.id, undefined, { numeric: true }),
    },
    viewport: {
      options: {
        mobile: { name: 'Mobile', styles: { width: '425px', height: '844px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '844px' } },
        desktop: {
          name: 'Desktop',
          styles: { width: '1024px', height: '844px' },
        },
      },
    },
  },
};

export const decorators = [
  withThemeByDualDataAttributes({
    themes: {
      'storypoint-shuffle (light)': ['storypointshuffle', 'light'],
      'storypoint-shuffle (dark)': ['storypointshuffle', 'dark'],
    },
    defaultTheme: 'storypoint-shuffle (dark)',
  }),
];

export default preview;
