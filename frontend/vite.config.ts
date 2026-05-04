import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { analyzer } from "vite-bundle-analyzer";
import webfontDownload from "vite-plugin-webfont-dl";
// import Sitemap from 'vite-plugin-sitemap';
import svgr from "vite-plugin-svgr";

const plugins = [
  tailwindcss(),
  tanstackRouter({
    target: "react",
    autoCodeSplitting: true,
  }),
  react(),
  svgr(),
  analyzer({
    analyzerMode: "server",
    analyzerPort: "auto",
    enabled: false,
  }),
  webfontDownload(),
];

// TODO: not sure what to do about this, looks like there isn't a simple way to include
// this plugin configuration with vite+ in the same was as old vite since it bypasses buns
// auto config loading
// if (process.env.VITE_DISABLE_SITEMAP !== 'true') {
//   plugins.push(
//     Sitemap({
//       hostname: process.env.VITE_SITE_URL,
//       outDir: '../dist',
//     }),
//   );
// }

export default defineConfig({
  fmt: {
    ignorePatterns: ["*.gen.ts"],
  },
  lint: {
    jsPlugins: ["eslint-plugin-storybook", "eslint-plugin-react-refresh"],
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ["*.gen.ts", "**/.storybook/*"],
  },
  plugins,
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
