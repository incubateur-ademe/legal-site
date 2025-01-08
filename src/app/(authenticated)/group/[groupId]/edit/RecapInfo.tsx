"use client";

import { fr } from "@codegouvfr/react-dsfr";
import Alert from "@codegouvfr/react-dsfr/Alert";
import Tag from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type FC, type PropsWithChildren, useState } from "react";
import { useFormContext } from "react-hook-form";

import { RecapCard } from "@/dsfr/base/RecapCard";
import { explainGroupRule } from "@/lib/model/Group";

import { type FormType } from "./Form";

type InfoComponent = FC<{ values: FormType }>;
const CommonRuleInfo: FC<{ rules: FormType["membershipRules"] }> = ({ rules }) => (
  <>
    <p>
      Il est possible d'utiliser l'astérisque <code>*</code> pour préciser "tout le monde" ou "toutes les équipes
      d'Animation" (<code>animation/*</code>). Ce n'est en revanche pas possible pour les autres types de règle.
    </p>
    <Alert
      severity="warning"
      small
      description="Attention aux règles qui peuvent entrer en conflit les unes avec les autres !"
    />
    <hr />
    {rules.length ? (
      <>
        Règles actuelles expliquées :
        <ul>
          {rules.map((rule, index) => (
            <li key={`${rule.rule}-${index}`}>
              <Tag small>{rule.rule}</Tag> {explainGroupRule(rule)}
            </li>
          ))}
        </ul>
      </>
    ) : (
      "Aucune règle paramétrée."
    )}
  </>
);
const RECAP_INFOS = {
  start: ({ values }) => (
    <>
      <p>
        Pour créer ou éditer un groupe, vous devez renseigner quelques informations de base. Ces informations permettent
        de personnaliser votre groupe et de définir qui peut le rejoindre.
      </p>
      <p>Survolez les sections pour avoir un complément d'information sur l'utilisation des propriétés.</p>
    </>
  ),
  id: ({ values }) => (
    <>
      <p>
        L'identifiant est ce qui permet a un groupe d'avoir une URL unique. Il doit être unique et ne peut pas être
        modifié une fois le groupe créé.
      </p>
      <p>
        En général, il est conseillé de choisir un identifiant court, sans caractères spéciaux et sans espaces. Par
        exemple :<code>beta-gouv</code> au lieu de <code>Béta Gouv</code>.
      </p>
      <p>Pour une nom plus complet, vous pouvez ajouter un nom de groupe qui sera affiché sur la page du groupe.</p>
    </>
  ),
  nom: ({ values }) => (
    <>
      <p>
        Le nom du groupe est le nom complet du groupe qui sera affiché sur la page du groupe. Il peut être modifié à
        tout moment et permet d'identifier rapidement à qui appartient le groupe.
      </p>
      <p>
        Si vous souhaiter une description plus détaillée du groupe, vous pouvez ajouter une description qui sera
        affichée sur la page du groupe.
      </p>
    </>
  ),
  description: ({ values }) => (
    <>
      <p>
        La description du groupe est une courte description de ce que fait le groupe. Elle est affichée sur la page du
        groupe et permet de comprendre rapidement le but du groupe.
      </p>
    </>
  ),
  owners: ({ values }) => (
    <>
      <p>
        Les propriétaires du groupe sont les personnes qui peuvent modifier les paramètres du groupe, ajouter des
        membres, et gérer les règles de fonctionnement du groupe.
      </p>
      <p>Les propriétaires peuvent ajouter d'autres propriétaires et modifier les règles du groupe.</p>
      <p>Il est obligatoire d'avoir au moins une règle active.</p>
      <CommonRuleInfo rules={values.owners} />
    </>
  ),
  membershipRules: ({ values }) => (
    <>
      <p>
        Les règles de fonctionnement du groupe permettent de définir qui peut rejoindre le groupe et sous quelles
        conditions.
      </p>
      <p>
        Par exemple, vous pouvez définir des règles pour que seuls les membres d'une organisation puissent rejoindre le
        groupe, ou que seuls les membres ayant une adresse email en particulier puissent rejoindre le groupe, et ce
        optionnellement, sur uen période de validité donnée.
      </p>
      <p>Un membre ne peut que modifier ou créer un template.</p>
      <CommonRuleInfo rules={values.membershipRules} />
    </>
  ),
} as const satisfies Record<string, InfoComponent>;

export const RECAP_TITLES: Record<keyof typeof RECAP_INFOS, string> = {
  start: "Commencer",
  id: "Identifiant",
  nom: "Nom du groupe",
  description: "Description",
  owners: "Règles de propriétaires",
  membershipRules: "Règles de membres",
} as const;

export interface RecapInfoProps {
  setStep: (step: keyof typeof RECAP_INFOS) => void;
  step: keyof typeof RECAP_INFOS;
}
export const RecapInfo = ({ step }: RecapInfoProps) => {
  const { watch } = useFormContext<FormType>();
  const values = watch();
  return <RecapCard className="sticky top-8" title={RECAP_TITLES[step]} content={RECAP_INFOS[step]({ values })} />;
};

export const RecapInfoHover = ({ children, step, setStep }: PropsWithChildren<RecapInfoProps>) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cx(fr.cx("fr-mb-4w"), {
        "outline outline-offset-8 outline-[--border-action-high-info]": isHovered,
      })}
      onMouseEnter={() => {
        setIsHovered(true);
        setStep(step);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {children}
    </div>
  );
};
