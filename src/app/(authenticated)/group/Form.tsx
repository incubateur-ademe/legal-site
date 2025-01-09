"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import Input from "@codegouvfr/react-dsfr/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { ClientOnly } from "@/components/utils/ClientOnly";
import { Grid, GridCol } from "@/dsfr";
import { type Group, GroupRule } from "@/lib/model/Group";

import { saveGroup } from "./actions";
import { MembershipRuleSelect } from "./MembershipRuleSelect";
import { RECAP_TITLES, RecapInfo, RecapInfoHover } from "./RecapInfo";

const formSchema = z.object({
  id: z.string().nonempty("L'identifiant est requis"),
  name: z.string().nonempty("Le nom du groupe est requis"),
  description: z.string().nonempty("Une description minimale est requise"),
  owners: z.array(z.object({ rule: GroupRule.shape.rule })).nonempty("Au moins un propriétaire est requis"),
  membershipRules: z.array(GroupRule),
});

export type FormType = z.infer<typeof formSchema>;

export const GroupForm = ({ editGroup }: { editGroup?: Group }) => {
  const router = useRouter();
  const [step, setStep] = useState<keyof typeof RECAP_TITLES>("start");
  const [saveError, setSaveError] = useState<string | null>(null);

  const methods = useForm<FormType>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: editGroup?.id ?? "",
      name: editGroup?.name ?? "",
      description: editGroup?.description ?? "",
      owners: (editGroup?.owners ?? []).map(rule => ({ rule })),
      membershipRules: editGroup?.membershipRules ?? [],
    },
  });

  const { formState, handleSubmit, register } = methods;

  const { isValid, isDirty, errors } = formState;

  async function onSubmit(data: FormType) {
    const response = await saveGroup(
      {
        id: data.id,
        name: data.name,
        description: data.description,
        owners: data.owners.map(owner => owner.rule),
        membershipRules: data.membershipRules,
        templates: [],
      },
      !editGroup,
    );

    if (response.ok) {
      return router.push("/group");
    }
    setSaveError(response.error);
  }

  return (
    <ClientOnly>
      <FormProvider {...methods}>
        {/* <ReactHookFormDebug formState={formState} /> */}
        <Grid haveGutters>
          <GridCol base={8}>
            <form noValidate onSubmit={e => void handleSubmit(onSubmit)(e)}>
              {editGroup?.id ? (
                <input type="hidden" {...register("id")} />
              ) : (
                <RecapInfoHover step={"id"} setStep={setStep}>
                  <Input
                    label={RECAP_TITLES["id"]}
                    state={errors.id && "error"}
                    stateRelatedMessage={errors.id?.message}
                    classes={{
                      nativeInputOrTextArea: "field-sizing-content !w-auto !min-w-64",
                    }}
                    nativeInputProps={{ ...register("id") }}
                  />
                </RecapInfoHover>
              )}
              <RecapInfoHover step={"nom"} setStep={setStep}>
                <Input
                  label={RECAP_TITLES["nom"]}
                  state={errors.name && "error"}
                  stateRelatedMessage={errors.name?.message}
                  classes={{
                    nativeInputOrTextArea: "field-sizing-content !w-auto !min-w-64",
                  }}
                  nativeInputProps={{ ...register("name") }}
                />
              </RecapInfoHover>
              <RecapInfoHover step={"description"} setStep={setStep}>
                <Input
                  label={RECAP_TITLES["description"]}
                  state={errors.description && "error"}
                  stateRelatedMessage={errors.description?.message}
                  nativeInputProps={{ ...register("description") }}
                />
              </RecapInfoHover>
              <RecapInfoHover step={"owners"} setStep={setStep}>
                <MembershipRuleSelect formSchema={formSchema} formKey="owners" legend={RECAP_TITLES["owners"]} />
              </RecapInfoHover>
              <RecapInfoHover step={"membershipRules"} setStep={setStep}>
                <MembershipRuleSelect
                  formSchema={formSchema}
                  formKey="membershipRules"
                  legend={RECAP_TITLES["membershipRules"]}
                  withTtl
                />
              </RecapInfoHover>
              <ClientAnimate>
                {saveError && (
                  <Alert
                    className={fr.cx("fr-mb-4w")}
                    title="Erreur lors de la sauvegarde"
                    description={saveError}
                    severity="error"
                    closable
                  />
                )}
              </ClientAnimate>
              <ButtonsGroup
                buttonsEquisized
                inlineLayoutWhen="sm and up"
                buttons={[
                  {
                    children: "Enregistrer",
                    disabled: !isValid || !isDirty,
                    priority: "primary",
                    nativeButtonProps: {
                      type: "submit",
                    },
                  },
                  {
                    children: "Annuler",
                    type: "reset",
                    priority: "secondary",
                    onClick() {
                      router.push("/group");
                    },
                  },
                ]}
              />
            </form>
          </GridCol>
          <GridCol base={4}>
            <RecapInfo step={step} setStep={setStep} />
          </GridCol>
        </Grid>
      </FormProvider>
    </ClientOnly>
  );
};
