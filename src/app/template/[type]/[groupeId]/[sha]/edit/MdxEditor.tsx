"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { Editor, loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { conf as mdxConf, language as mdxLangage } from "monaco-editor/esm/vs/basic-languages/mdx/mdx";
import { Fragment, type ReactElement, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Grid, GridCol } from "@/dsfr";
import { mdxRenderer } from "@/lib/mdx/renderer";
import { frHexColor } from "@/utils/dsfrHexColors";
import { frHexColorDark } from "@/utils/dsfrHexDarkColors";

import style from "./MdxEditor.module.scss";

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

const mdxEditorFormSchema = z.object({
  variables: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().optional().default(""),
      }),
    )
    .refine(
      data =>
        // Check that all variables have a unique name
        new Set(data.map(({ name }) => name)).size === data.length,
      {
        message: "Les noms de variables doivent être uniques",
      },
    ),
  mdxContent: z.string(),
});

type MdxEditorFormType = z.infer<typeof mdxEditorFormSchema>;

export const MdxEditor = ({ defaultValue }: { defaultValue: string }) => {
  const { isDark } = useIsDark();
  const [mdxSource, setMdxSource] = useState<string>(defaultValue);
  const [frontmatter, setFrontmatter] = useState<Record<string, unknown>>({});
  const [content, setContent] = useState<ReactElement | null>(null);

  const {
    register,
    formState: { errors, isValid },
    watch,
    handleSubmit,
    control,
  } = useForm<MdxEditorFormType>();

  const {
    fields: varFields,
    append: appendVar,
    remove: removeVar,
  } = useFieldArray({
    control,
    name: "variables",
  });

  function handleEditorChange(value?: string) {
    value && setMdxSource(value);
  }

  useEffect(() => {
    void (async () => {
      const { content, frontmatter } = await mdxRenderer(mdxSource, {});
      setFrontmatter(frontmatter);
      setContent(content);
    })();
  }, [mdxSource]);

  return (
    <form onSubmit={void handleSubmit(data => console.log(data))}>
      <Grid haveGutters className={style.editor}>
        <GridCol base={2} px="3w">
          <Button
            size="small"
            priority="secondary"
            iconId="fr-icon-add-line"
            type="button"
            onClick={() =>
              appendVar(
                { name: "", description: "" },
                { shouldFocus: true, focusName: `variables.${varFields.length}.name` },
              )
            }
          >
            Ajouter une variable
          </Button>
          {varFields.map((field, index) => {
            const name = `variables.${index}.name` as const;
            const description = `variables.${index}.description` as const;
            return (
              <Fragment key={field.id}>
                <hr className={fr.cx("fr-mt-2w", "fr-pb-1w")} />
                <Input
                  nativeInputProps={{
                    ...register(name),
                    placeholder: `Nom ${index + 1}`,
                  }}
                  hideLabel
                  label={`Nom variable ${index + 1}`}
                  action={
                    <Button
                      iconId="fr-icon-delete-line"
                      type="button"
                      priority="secondary"
                      title="Supprimer la variable"
                      onClick={() => removeVar(index)}
                    />
                  }
                />
                <Input
                  textArea
                  classes={{
                    nativeInputOrTextArea: "resize-y",
                  }}
                  nativeTextAreaProps={{
                    ...register(description),
                    placeholder: `Description ${index + 1}`,
                  }}
                  hideLabel
                  label={`Description variable ${index + 1}`}
                />
              </Fragment>
            );
          })}
        </GridCol>
        <GridCol base={5}>
          <Editor
            defaultValue={defaultValue}
            language="mdx-mustache"
            theme={`mdx-mustache-theme-${isDark ? "dark" : "light"}`}
            onChange={handleEditorChange}
            options={{
              automaticLayout: true,
              codeLens: false,
              scrollBeyondLastLine: false,
              wordWrap: "bounded",
            }}
          />
        </GridCol>
        <GridCol base={5} className="overflow-auto h-full">
          <code>{JSON.stringify({ frontmatter })}</code>
          {content}
        </GridCol>
      </Grid>
    </form>
  );
};
