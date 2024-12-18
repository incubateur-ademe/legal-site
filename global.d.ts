// add custom Next tags
interface NextFetchRequestConfig {
  tags?: Array<"test" | "yo" | (string & { _?: never })>;
}

// hack to get monaco-editor to work with esm imports
declare module "monaco-editor/esm/vs/basic-languages/*" {
  import type monaco from "monaco-editor";

  export const conf: monaco.languages.LanguageConfiguration;
  export const language: monaco.languages.IMonarchLanguage;
}
