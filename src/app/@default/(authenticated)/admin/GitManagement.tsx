"use client";

import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { useState } from "react";

import { FormFieldset } from "@/dsfr";

import { cleanGitLocalRepo } from "./actions";

export const GitManagement = () => {
  const [gitResult, setGitResult] = useState<string>("");
  return (
    <FormFieldset
      legend="Git management (all operations includes a revalidation of the layout cache)"
      elements={[
        <ButtonsGroup
          key={0}
          inlineLayoutWhen="sm and up"
          buttonsEquisized
          buttons={[
            {
              children: "Clean local repo",
              onClick: () => {
                try {
                  void cleanGitLocalRepo().then(setGitResult);
                } catch (error) {
                  setGitResult((error as Error).message);
                }
              },
            },
          ]}
        />,
        <Input
          label="Git result"
          key={1}
          textArea
          disabled
          nativeTextAreaProps={{
            value: gitResult,
          }}
        />,
      ]}
    />
  );
};
