// This component is based on the code from the skeleton documentation
import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const highlighter = await createHighlighterCore({
  langs: [import("@shikijs/langs/json"), import("@shikijs/langs/toml")],
  themes: [import("@shikijs/themes/material-theme")],
  engine: createJavaScriptRegexEngine(),
});

function CodeBlock({
  code,
  lang = "txt",
  base = "overflow-hidden",
  background = "bg-neutral-950",
  rounded = "rounded-container",
  shadow = "",
  classes = "",
  preBase = "",
  prePadding = "[&>pre]:p-4",
  preClasses = "",
}: {
  code: Parameters<typeof highlighter.codeToHtml>[0];
  lang?: Parameters<typeof highlighter.codeToHtml>[1]["lang"];
  base?: string;
  background?: string;
  rounded?: string;
  shadow?: string;
  classes?: string;
  preBase?: string;
  prePadding?: string;
  preClasses?: string;
}) {
  const html = highlighter.codeToHtml(code, { lang, theme: "material-theme" });

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className={`${base} ${background} ${rounded} ${shadow} ${classes} ${preBase} ${prePadding} ${preClasses}`}
    ></div>
  );
}

export { CodeBlock };
