"use client";

import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";

export const MdxEditor = ({ defaultValue }: { defaultValue: string }) => {
  loader.config({
    monaco,
  });
  return <Editor defaultValue={defaultValue} />;
};
