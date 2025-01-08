"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Button from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@monaco-editor/react";
import { redirect } from "next/navigation";
import { Fragment, type ReactElement, use, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { Container, Grid, GridCol } from "@/dsfr";
import { RecapCard } from "@/dsfr/base/RecapCard";
import { CUSTOM_LANGUAGE_ID, getCustomThemeID, preloadMonacoReact } from "@/lib/client/monaco";
import { type Template } from "@/lib/model/Template";
import { getService } from "@/lib/services";
import { type SimpleObject } from "@/utils/types";

import { saveTemplate } from "../actions";
import styles from "./MdxEditor.module.scss";

void preloadMonacoReact();

const mdxEditorFormSchema = z
  .object({
    variables: z.array(
      z.object({
        name: z.string().min(1, "Le nom de la variable est requis"),
        description: z.string().optional().default(""),
      }),
    ),
    mdxContent: z.string(),
  })
  .superRefine(({ variables, mdxContent }, ctx) => {
    const names = variables.map(({ name }) => name);
    for (let i = 0; i < names.length; i++) {
      const name = names[i];
      if (names.filter(n => n === name).length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Le nom de variable "${name}" est déjà utilisé`,
          path: ["variables", i, "name"],
        });
      }

      const regex = new RegExp(`{{\\s*${name}\\s*}}`, "g");
      if (!regex.test(mdxContent)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `La variable "{{ ${name} }}" n'est pas utilisée dans le contenu`,
          path: ["variables", i, "name"],
        });
      }
    }
  });

type MdxEditorFormType = z.infer<typeof mdxEditorFormSchema>;

interface MdxEditorProps {
  raw: string;
  template: Template;
}
const mdx = getService("mdx");
export const MdxEditor = ({ raw, template }: MdxEditorProps) => {
  const { isDark } = useIsDark();
  const [mdxSource, setMdxSource] = useState<string>(raw);
  const [content, setContent] = useState<ReactElement | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const mdxService = use(mdx);

  const {
    register,
    formState: { errors, isValid, isDirty },
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
  } = useForm<MdxEditorFormType>({
    mode: "onChange",
    resolver: zodResolver(mdxEditorFormSchema),
    defaultValues: {
      variables: Object.entries(template.variables).map(([name, description]) => ({ name, description })),
      mdxContent: raw,
    },
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
      shouldDirty: true,
    });
    void trigger("variables");
  }

  async function onSubmit(data: MdxEditorFormType) {
    const response = await saveTemplate(
      {
        ...template,
        variables: data.variables.reduce<SimpleObject<string>>((acc, { name, description }) => {
          acc[name] = description;
          return acc;
        }, {}),
      },
      data.mdxContent,
    );

    if (response.ok) {
      redirect(`/template/${template.type}/${template.groupId}/${response.data}/edit`);
    }
    setSaveError(response.error);
  }

  useEffect(() => {
    if (isValid) {
      void (async () => {
        const formattedVars = getValues("variables").reduce<SimpleObject<string>>((acc, { name, description }) => {
          acc[name] = description;
          return acc;
        }, {});
        const content = await mdxService.renderRawAsDisplayableComponent(mdxSource, formattedVars);
        setContent(content);
      })();
    }
  }, [mdxSource, getValues, isValid]);

  return (
    <>
      <Container>
        <ClientAnimate>
          {saveError && (
            <Alert title="Erreur lors de la sauvegarde" description={saveError} severity="error" closable />
          )}
        </ClientAnimate>
      </Container>
      <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
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
              disabled: !isValid || !isDirty,
              nativeButtonProps: {
                type: "submit",
              },
              iconId: "fr-icon-save-line",
              iconPosition: "right",
              priority: "primary",
            },
          ]}
        />
        <Grid haveGutters className={styles.editor}>
          <GridCol base={2} className="h-full overflow-y-auto">
            <RecapCard
              title="Variables"
              className={cx(!!errors.variables?.length && styles["variables-panel--error"])}
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
                    const nameId = `variables.${index}.name` as const;
                    const descriptionId = `variables.${index}.description` as const;
                    return (
                      <Fragment key={field.id}>
                        <hr className={fr.cx("fr-mt-2w", "fr-pb-1w")} />
                        <Input
                          nativeInputProps={{
                            ...register(nameId),
                            placeholder: `Nom ${index + 1}`,
                            id: nameId,
                          }}
                          hideLabel
                          label={`Nom variable ${index + 1}`}
                          state={errors.variables?.[index] && "error"}
                          stateRelatedMessage={errors.variables?.[index]?.name?.message}
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
                            ...register(descriptionId),
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
              defaultValue={raw}
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
          <GridCol base={5} className="overflow-y-auto h-full">
            <RecapCard title="Aperçu" content={content} />
          </GridCol>
        </Grid>
      </form>
    </>
  );
};
