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
