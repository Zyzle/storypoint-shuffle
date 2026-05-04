/* eslint-disable */
import type { Preview, StoryContext, StoryFn } from "@storybook/react-vite";
import { DecoratorHelpers } from "@storybook/addon-themes";
import { useEffect as usePreviewEffect } from "storybook/preview-api";
import { DocsContainer } from "@storybook/addon-docs/blocks";
import { themes as docsThemes } from "storybook/theming";

const { initializeThemeState, pluckThemeFromContext, useThemeParameters } = DecoratorHelpers;

import "../index.css";

const THEME_MODES = {
  "storypoint-shuffle (light)": "light",
  "storypoint-shuffle (dark)": "dark",
} as const;

const DEFAULT_THEME_KEY = "storypoint-shuffle (dark)";

// Based on a snippet provided by JonJamesDesign here https://github.com/storybookjs/storybook/discussions/25944#discussioncomment-10458288
const withThemeByDualDataAttributes = ({
  themes,
  defaultTheme,
}: {
  themes: Record<string, [string, string]>;
  defaultTheme: string;
}) => {
  initializeThemeState(Object.keys(themes), defaultTheme);

  return (storyFn: StoryFn, context: StoryContext) => {
    const { themeOverride } = context.parameters.themes ?? {};
    const selectedTheme = pluckThemeFromContext(context);

    usePreviewEffect(() => {
      const parentElement = document.querySelector("html");
      const themeKey = themeOverride || selectedTheme || defaultTheme;

      const [theme, mode] = themes[themeKey];

      if (parentElement) {
        parentElement.setAttribute("data-theme", theme);
        parentElement.setAttribute("data-mode", mode);
      }
    }, [themeOverride, selectedTheme]);

    return storyFn({}, context);
  };
};

const preview: Preview = {
  parameters: {
    docs: {
      container: ({ context, children }: { context: any; children: React.ReactNode }) => {
        const activeTheme =
          (context.store.userGlobals.globals.theme as keyof typeof THEME_MODES | undefined) ??
          DEFAULT_THEME_KEY;
        const mode = THEME_MODES[activeTheme] ?? THEME_MODES[DEFAULT_THEME_KEY];

        return (
          <DocsContainer
            context={context}
            theme={mode === "dark" ? docsThemes.dark : docsThemes.light}
          >
            {children}
          </DocsContainer>
        );
      },
    },
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
      test: "todo",
    },
    viewport: {
      options: {
        mobile: { name: "Mobile", styles: { width: "425px", height: "844px" } },
        tablet: { name: "Tablet", styles: { width: "768px", height: "844px" } },
        desktop: {
          name: "Desktop",
          styles: { width: "1024px", height: "844px" },
        },
      },
    },
  },
};

export const decorators = [
  withThemeByDualDataAttributes({
    themes: {
      "storypoint-shuffle (light)": [
        "storypointshuffle",
        THEME_MODES["storypoint-shuffle (light)"],
      ],
      "storypoint-shuffle (dark)": ["storypointshuffle", THEME_MODES["storypoint-shuffle (dark)"]],
    },
    defaultTheme: DEFAULT_THEME_KEY,
  }),
];

export default preview;
