"use client";

import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { conf as mdxConf, language as mdxLangage } from "monaco-editor/esm/vs/basic-languages/mdx/mdx";

import { frHexColor } from "@/utils/dsfrHexColors";
import { frHexColorDark } from "@/utils/dsfrHexDarkColors";

loader.config({
  monaco,
});

void loader.init().then(monacoInstance => {
  monacoInstance.languages.register({ id: "mdx-mustache" });
  monacoInstance.languages.setMonarchTokensProvider("mdx-mustache", {
    ...mdxLangage,
    tokenizer: {
      ...mdxLangage.tokenizer,
      // redefine the content rule to add mustache-variable
      content: [
        [
          /\{\{/,
          {
            token: "mustache-bracket",
            bracket: "@open",
            next: "@mustache-variable",
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
      "mustache-variable": [
        [/\s*([\w.]+)\s*/, "mustache-variable"],
        [
          /\}\}/,
          {
            token: "mustache-bracket",
            bracket: "@close",
            next: "@pop",
          },
        ],
      ],
    },
  });
  monacoInstance.languages.setLanguageConfiguration("mdx-mustache", {
    ...mdxConf,
    brackets: [
      ["[", "]"],
      ["(", ")"],
    ],
  });

  const textDefaultInfoDark = frHexColorDark.decisions.artwork.major.pinkTuile.default;
  const backgroundContrastInfoDark = frHexColorDark.decisions.background.contrast.pinkTuile.default;
  const textDefaultInfoLight = frHexColor.decisions.artwork.major.pinkTuile.default;
  const backgroundContrastInfoLight = frHexColor.decisions.background.contrast.pinkTuile.default;
  const bracketColor = frHexColor.decisions.border.default.brownCafeCreme.default;

  monacoInstance.editor.defineTheme("mdx-mustache-theme-dark", {
    base: "vs-dark", // Hérite du thème sombre par défaut
    inherit: true,
    colors: {
      "editor.background": frHexColorDark.decisions.background.raised.grey.default,
    },
    rules: [
      { token: "mustache-variable", foreground: textDefaultInfoDark, background: backgroundContrastInfoDark },
      { token: "mustache-bracket", foreground: bracketColor, background: backgroundContrastInfoDark },
    ],
  });

  monacoInstance.editor.defineTheme("mdx-mustache-theme-light", {
    base: "vs", // Hérite du thème clair par défaut
    inherit: true,
    colors: {
      "editor.background": frHexColor.decisions.background.raised.grey.default,
    },
    rules: [
      {
        token: "mustache-variable",
        foreground: textDefaultInfoLight,
        background: backgroundContrastInfoLight,
        fontStyle: "bold underline",
      },
      {
        token: "mustache-bracket",
        foreground: bracketColor,
        background: backgroundContrastInfoLight,
        fontStyle: "bold underline",
      },
    ],
  });
});

export const MdxEditor = ({ defaultValue }: { defaultValue: string }) => {
  const { isDark } = useIsDark();
  return (
    <Editor
      defaultValue={defaultValue}
      language="mdx-mustache"
      theme={`mdx-mustache-theme-${isDark ? "dark" : "light"}`}
      // wrapperProps={{
      //   // style: {
      //   //   // height: "100%",
      //   // },
      // }}
      // className={style.editor}
      height="28em"
    />
  );
};
