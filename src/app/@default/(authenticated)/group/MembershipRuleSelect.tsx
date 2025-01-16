"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import Select from "@codegouvfr/react-dsfr/Select";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { Fragment, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { type z } from "zod";

import { ClientAnimate } from "@/components/utils/ClientAnimate";
import { HoverToggler } from "@/components/utils/HoverToggler";
import { FormFieldset, Grid, GridCol } from "@/dsfr";
import { type GroupRuleType, GroupRuleTypeName } from "@/lib/model/Group";
import { type Any, type SimpleObject } from "@/utils/types";

export interface MembershipRuleSelectProps<
  FormSchema extends z.ZodType,
  FormType extends z.infer<FormSchema>,
  WithTtl extends boolean,
  FormKey extends FormKeySelector<FormType, WithTtl>,
> {
  formKey: FormKey;
  formSchema: FormSchema;
  legend: string;
  withTtl?: WithTtl;
}

type FormKeySelector<FormType extends SimpleObject, WithTtl extends boolean = false> = {
  [key in keyof FormType]: FormType[key] extends Any[]
    ? Required<FormType[key][0]> extends (
        WithTtl extends true ? { rule: string; ttlEnd: Date; ttlStart: Date } : { rule: string }
      )
      ? key
      : never
    : never;
}[keyof FormType];

type FakeFormType = {
  _: Array<{ rule: string; ttlEnd?: Date; ttlStart?: Date }>;
};
export const MembershipRuleSelect = <
  FormSchema extends z.ZodType,
  FormType extends z.infer<FormSchema>,
  WithTtl extends boolean,
  FormKey extends FormKeySelector<FormType, WithTtl>,
>({
  formKey: _formKey,
  legend,
  withTtl,
}: MembershipRuleSelectProps<FormSchema, FormType, WithTtl, FormKey>) => {
  const [ruleTypeSelected, setRuleTypeSelected] = useState<GroupRuleType | "" | "*">("");
  const [ruleValue, setRuleValue] = useState<string>("");
  const [ruleAlreadyAdded, setRuleAlreadyAdded] = useState<boolean>(false);
  const [ruleDupeIndex, setRuleDupeIndex] = useState<number>(-1);
  const [ruleTtlStart, setRuleTtlStart] = useState<Date | null>(null);
  const [ruleTtlEnd, setRuleTtlEnd] = useState<Date | null>(null);
  const [badWildcard, setBadWildcard] = useState<boolean>(false);

  const {
    formState: { errors },
    control,
  } = useFormContext<FakeFormType>();

  const formKey = _formKey as "_";

  const { fields, append, remove } = useFieldArray({
    control,
    name: formKey,
  });

  function onAddOwnersRule() {
    const rule: FakeFormType["_"][number] = {
      rule: ruleTypeSelected === "*" ? "*" : `${ruleTypeSelected}/${ruleValue}`,
    };
    if (rule.rule === "/") return;

    if (withTtl) {
      if (ruleTtlStart) {
        rule.ttlStart = ruleTtlStart;
      }
      if (ruleTtlEnd) {
        rule.ttlEnd = ruleTtlEnd;
      }
    }
    append(rule);
    setRuleValue("");
    setRuleTtlStart(null);
    setRuleTtlEnd(null);
  }

  function checkOwnersRuleValue(ruleType: GroupRuleType | "*", ruleValue: string) {
    const computedValue = ruleType === "*" ? "*" : `${ruleType}/${ruleValue.trim()}`;

    const dupeIndex = fields.findIndex(rule => rule.rule === computedValue);
    if (dupeIndex !== -1) {
      setRuleAlreadyAdded(true);
      setRuleDupeIndex(fields.findIndex(rule => rule.rule === computedValue));
    } else {
      setRuleAlreadyAdded(false);
      setRuleDupeIndex(-1);
    }

    if (ruleType !== "*" && ruleValue.trim() === "*") {
      setBadWildcard(true);
    } else {
      setBadWildcard(false);
    }
  }

  const formattedTtlStart = ruleTtlStart?.toISOString().split("T")[0] ?? "";
  const formattedTtlEnd = ruleTtlEnd?.toISOString().split("T")[0] ?? "";

  return (
    <FormFieldset
      legend={legend}
      error={errors[formKey]?.message || (ruleAlreadyAdded && "Règles en doublon")}
      elements={[
        <ClientAnimate key={formKey} className="flex flex-wrap gap-2">
          {fields.map((field, index) => {
            const oneRemaining = fields.length === 1;
            const hasTtl = !!(field.ttlEnd || field.ttlStart);

            return (
              <Fragment key={field.id}>
                <HoverToggler
                  className="flex-0"
                  normal={
                    <Tag
                      className={cx({
                        "outline outline-[--border-action-high-error]": ruleAlreadyAdded && ruleDupeIndex === index,
                      })}
                      iconId={(hasTtl && "fr-icon-time-line") as never}
                    >
                      {field.rule}
                    </Tag>
                  }
                  hover={
                    <Tag
                      style={{ width: `${Math.max(11, field.rule.length) + 2}ch` }}
                      title={oneRemaining ? "Impossible de supprimer la dernière règle" : "Supprimer"}
                      nativeButtonProps={{
                        type: "button",
                        disabled: oneRemaining,
                        onClick: () => !oneRemaining && remove(index),
                      }}
                    >
                      Supprimer ?
                    </Tag>
                  }
                />
              </Fragment>
            );
          })}
        </ClientAnimate>,
        <Grid key={`${formKey}-add`} haveGutters>
          <GridCol base={5}>
            <Select
              label=""
              nativeSelectProps={{
                value: ruleTypeSelected,
                onInput: e => {
                  const value = e.currentTarget.value as GroupRuleType;
                  setRuleTypeSelected(() => {
                    checkOwnersRuleValue(value, ruleValue);
                    return value;
                  });
                },
              }}
            >
              <option value="" disabled>
                Sélectionner un type de règle
              </option>
              <option value="*">Tout le monde (*)</option>
              {Object.entries(GroupRuleTypeName).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </Select>
          </GridCol>
          <GridCol base={5}>
            <Input
              hideLabel
              label="Règle"
              disabled={ruleTypeSelected === "*"}
              classes={{
                nativeInputOrTextArea: fr.cx("fr-mt-0"),
              }}
              state={badWildcard ? "error" : "default"}
              stateRelatedMessage={
                badWildcard && (
                  <span>
                    L'astérisque (*) est inutile pour ce type de règle. Séléctionnez le type "
                    <a
                      onClick={e => {
                        e.preventDefault();
                        setRuleTypeSelected(() => {
                          setRuleValue(() => {
                            checkOwnersRuleValue("*", "");
                            return "";
                          });
                          return "*";
                        });
                      }}
                      href="#"
                    >
                      Tout le monde
                    </a>
                    " si c'est ce que vous souhaitez.
                  </span>
                )
              }
              nativeInputProps={{
                value: ruleValue,
                placeholder:
                  ruleTypeSelected === "*"
                    ? "Tout le monde"
                    : ruleTypeSelected
                      ? `Filtre par ${GroupRuleTypeName[ruleTypeSelected]}`
                      : "Sélectionner un type de règle",
                onInput: e => {
                  const value = e.currentTarget.value;
                  setRuleValue(() => {
                    checkOwnersRuleValue(ruleTypeSelected as GroupRuleType, value);
                    return value;
                  });
                },
                onKeyDown: e => e.key === "Enter" && (e.preventDefault(), onAddOwnersRule()),
              }}
            />
          </GridCol>
        </Grid>,
        withTtl && (
          <Grid key={`${formKey}-ttl`} haveGutters>
            <GridCol base={4}>
              <Input
                label="Début de validité"
                hintText="Optionnel"
                nativeInputProps={{
                  type: "date",
                  value: formattedTtlStart,
                  onInput: e => {
                    setRuleTtlStart(e.currentTarget.valueAsDate);
                  },
                }}
              />
            </GridCol>
            <GridCol base={4}>
              <Input
                label="Fin de validité"
                hintText="Optionnel"
                nativeInputProps={{
                  type: "date",
                  value: formattedTtlEnd,
                  onInput: e => {
                    setRuleTtlEnd(e.currentTarget.valueAsDate);
                  },
                }}
              />
            </GridCol>
          </Grid>
        ),
        <Button
          key={"owners-add-button"}
          priority="secondary"
          type="button"
          // disabled if no rule type selected, no rule value, rule already added or rule type is not "*" and no rule value
          disabled={(ruleTypeSelected !== "*" && !ruleValue) || !ruleTypeSelected || ruleAlreadyAdded}
          onClick={onAddOwnersRule}
        >
          Ajouter une règle
        </Button>,
      ]}
    />
  );
};
