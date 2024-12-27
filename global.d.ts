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

declare module "@codegouvfr/react-dsfr/dsfr/*.svg" {
  import { type StaticImageData } from "next/image";

  const value: StaticImageData;
  // eslint-disable-next-line import/no-default-export
  export default value;
}

declare module "@/dsfr/*.svg" {
  import { type StaticImageData } from "next/image";

  const value: StaticImageData;
  // eslint-disable-next-line import/no-default-export
  export default value;
}
