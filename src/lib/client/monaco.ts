"use client";

import { loader } from "@monaco-editor/react";
import * as _monaco from "monaco-editor";
import { conf as mdxConf, language as mdxLangage } from "monaco-editor/esm/vs/basic-languages/mdx/mdx";

import { frHexColor } from "@/utils/dsfrHexColors";
import { frHexColorDark } from "@/utils/dsfrHexDarkColors";

let initialized = false;

export const CUSTOM_LANGUAGE_ID = "mdx-mustache";

export function getCustomThemeID(isDark: boolean) {
  return `${CUSTOM_LANGUAGE_ID}-theme-${isDark ? "dark" : "light"}`;
}

const enum TOKENS {
  BRACKET = "mustache-bracket",
  VARIABLE = "mustache-variable",
}

export async function preloadMonacoReact() {
  if (initialized) {
    return;
  }

  loader.config({
    monaco: _monaco,
  });

  const monaco = await loader.init();
  monaco.languages.register({ id: CUSTOM_LANGUAGE_ID });
  initCustomLanguageTokens(monaco);
  initCustomLanguageConfiguration(monaco);
  initCustomTheme(monaco);

  initialized = true;
}

function initCustomLanguageTokens(monaco: typeof _monaco) {
  monaco.languages.setMonarchTokensProvider(CUSTOM_LANGUAGE_ID, {
    ...mdxLangage,
    tokenizer: {
      ...mdxLangage.tokenizer,
      // redefine the content rule to add mustache-variable
      content: [
        [
          /\{\{/,
          {
            token: TOKENS.BRACKET,
            bracket: "@open",
            next: `@${TOKENS.VARIABLE}`,
          },
        ],
        [/(\[)(.+)(]\()(.+)(\s+".*")(\))/, ["", "string.link", "", "type.identifier", "string.link", ""]],
        [/(\[)(.+)(]\()(.+)(\))/, ["", "type.identifier", "", "string.link", ""]],
        [/(\[)(.+)(]\[)(.+)(])/, ["", "type.identifier", "", "type.identifier", ""]],
        [/(\[)(.+)(]:\s+)(\S*)/, ["", "type.identifier", "", "string.link"]],
        [/(\[)(.+)(])/, ["", "type.identifier", ""]],
        [/`.*`/, "variable.source"],
        [/_/, { token: "emphasis", next: "@emphasis_underscore" }],
        [/\*(?!\*)/, { token: "emphasis", next: "@emphasis_asterisk" }],
        [/\*\*/, { token: "strong", next: "@strong" }],
      ],
      [TOKENS.VARIABLE]: [
        [/\s*([\w.]+)\s*/, TOKENS.VARIABLE],
        [
          /\}\}/,
          {
            token: TOKENS.BRACKET,
            bracket: "@close",
            next: "@pop",
          },
        ],
      ],
    },
  });
}

function initCustomLanguageConfiguration(monaco: typeof _monaco) {
  monaco.languages.setLanguageConfiguration(CUSTOM_LANGUAGE_ID, {
    ...mdxConf,
    brackets: [
      ["[", "]"],
      ["(", ")"],
    ],
  });
}

function initCustomTheme(monaco: typeof _monaco) {
  (["dark", "light"] as const).forEach(theme => {
    const hexColor = theme === "dark" ? frHexColorDark : frHexColor;

    const textDefaultInfo = hexColor.decisions.artwork.major.pinkTuile.default;
    const backgroundContrastInfo = hexColor.decisions.background.contrast.pinkTuile.default;
    const bracketColor = hexColor.decisions.border.default.brownCafeCreme.default;

    monaco.editor.defineTheme(getCustomThemeID(theme === "dark"), {
      base: theme === "dark" ? "vs-dark" : "vs",
      inherit: true,
      colors: {
        "editor.background": hexColor.decisions.background.raised.grey.default,
      },
      rules: [
        { token: TOKENS.VARIABLE, foreground: textDefaultInfo, background: backgroundContrastInfo },
        { token: TOKENS.BRACKET, foreground: bracketColor, background: backgroundContrastInfo },
      ],
    });
  });
}
