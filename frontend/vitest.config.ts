import { defineConfig, mergeConfig } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const vitestConfig = defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
            storybookScript: "bun storybook --no-open",
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            provider: playwright({}),
            headless: true,
            instances: [{ browser: "chromium" }],
          },
          // TODO: there seems to be an issue here right now with compatibility between Storybook and Vite+s Vitest plugin, where the setup file is not being properly loaded.
          // for the moment `vp test` is broken
          setupFiles: ["./.storybook/vitest.setup.ts"],
        },
      },
    ],
  },
});

import viteConfig from "./vite.config";

export default defineConfig(() => {
  return mergeConfig(viteConfig, vitestConfig);
});
