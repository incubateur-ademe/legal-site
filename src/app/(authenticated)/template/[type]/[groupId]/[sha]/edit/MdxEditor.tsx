"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@monaco-editor/react";
import { Fragment, type ReactElement, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Grid, GridCol } from "@/dsfr";
import { RecapCard } from "@/dsfr/base/RecapCard";
import { CUSTOM_LANGUAGE_ID, getCustomThemeID, preloadMonacoReact } from "@/lib/client/monaco";

import style from "./MdxEditor.module.scss";

void preloadMonacoReact();

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
  const [content, setContent] = useState<ReactElement | null>(null);

  const {
    register,
    formState: { errors, isValid },
    watch,
    handleSubmit,
    control,
    trigger,
    setValue,
  } = useForm<MdxEditorFormType>({
    mode: "onChange",
    resolver: zodResolver(mdxEditorFormSchema),
  });

  const {
    fields: varFields,
    append: appendVar,
    remove: removeVar,
  } = useFieldArray({
    control,
    name: "variables",
  });

  function handleEditorChange(value?: string) {
    if (value === undefined) return;
    setMdxSource(value);
    setValue("mdxContent", value, {
      shouldTouch: true,
      shouldValidate: true,
    });
  }

  useEffect(() => {
    void (async () => {
      // const { content, frontmatter } = await mdxRenderer(mdxSource, {});
      // setFrontmatter(frontmatter);
      // setContent(content);
    })();
  }, [mdxSource]);

  return (
    <form noValidate onSubmit={e => void handleSubmit(data => console.log(data))(e)}>
      <ButtonsGroup
        inlineLayoutWhen="sm and up"
        buttonsEquisized
        buttons={[
          {
            children: "Retour",
            linkProps: {
              href: "/template",
            },
            iconId: "fr-icon-arrow-left-line",
            iconPosition: "left",
            priority: "secondary",
          },
          {
            children: "Sauvegarder",
            nativeButtonProps: {
              type: "submit",
              disabled: !isValid,
            },
            iconId: "fr-icon-save-line",
            iconPosition: "right",
            priority: "primary",
          },
        ]}
      />
      <Grid haveGutters className={style.editor}>
        <GridCol base={2} className="overflow-auto h-full">
          <RecapCard
            title="Variables"
            sideButtonProps={{
              title: "Ajouter une variable",
              size: "small",
              priority: "secondary",
              iconId: "fr-icon-add-line",
              type: "button",
              onClick: () =>
                appendVar(
                  { name: "", description: "" },
                  { shouldFocus: true, focusName: `variables.${varFields.length}.name` },
                ),
            }}
            content={
              <>
                Définissez les variables utilisées dans le contenu
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
              </>
            }
          />
        </GridCol>
        <GridCol base={5}>
          <Editor
            defaultValue={defaultValue}
            language={CUSTOM_LANGUAGE_ID}
            theme={getCustomThemeID(isDark)}
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
          <RecapCard
            title="Aperçu"
            content={
              <>
                {/* {content} */}
                <h1>superlongtitleazlkelzalalkkleazlzalkakleekllkeazklelka</h1>
                <br />
                Fake
                <br />
                Fake
                <br />
                Fake
                <br />
                Fake
                <br />
                Fake
                <br />
                Fake
                <br />
                Fake
                <br />
              </>
            }
          />
        </GridCol>
      </Grid>
    </form>
  );
};
