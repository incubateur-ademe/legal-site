"use client";

import { type ButtonProps } from "@codegouvfr/react-dsfr/Button";
import ButtonsGroup from "@codegouvfr/react-dsfr/ButtonsGroup";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type PropsWithChildren, type ReactNode, useState } from "react";

import styles from "./CollapsedSectionDynamicGroup.module.scss";

interface CollapsedSectionDynamicGroupProps {
  className?: string;
  data: Array<{
    content: ReactNode | string;
    id: string;
    title: string;
  }>;
}
export const CollapsedSectionDynamicGroup = ({ className, data }: CollapsedSectionDynamicGroupProps) => {
  const [isOpenAll, setIsOpenAll] = useState(false);
  const [isOpenIds, setIsOpenIds] = useState<string[]>([]);

  const handleOpenAll: ButtonProps["onClick"] = _ => {
    setIsOpenAll(!isOpenAll);
    setIsOpenIds(data.map(elt => elt.id));
    if (isOpenAll) {
      setIsOpenIds([]);
    }
  };

  const handleOpenSection: CollapsedSectionProps["openSection"] = (sectionId, sectionAlreadyOpen) => {
    setIsOpenIds([...isOpenIds, sectionId]);
    if (sectionAlreadyOpen) {
      setIsOpenIds(isOpenIds.filter(id => sectionId !== id));
    }
    setIsOpenAll(data.length === isOpenIds.length + 1);
  };
  if (data.length !== 0) {
    return (
      <div className={className}>
        <ButtonsGroup
          className="fr-no-print"
          buttonsEquisized
          alignment="right"
          buttonsSize="small"
          buttons={[
            {
              children: isOpenAll ? "Tout replier" : "Tout déplier",
              priority: "secondary",
              onClick: handleOpenAll,
              nativeButtonProps: {
                role: "status",
                "aria-live": "polite",
                "aria-atomic": "true",
              },
            },
          ]}
        />
        <ul className={styles.body}>
          {data.map(({ content, id, title }) => (
            <CollapsedSection
              title={title}
              key={`collapsedSection-${id}`}
              id={id}
              isOpen={isOpenIds.includes(id)}
              openSection={handleOpenSection}
            >
              {content}
            </CollapsedSection>
          ))}
        </ul>
      </div>
    );
  }
  return null;
};

type CollapsedSectionProps = PropsWithChildren<{
  id: string;
  isOpen?: boolean;
  openSection: (id: string, isOpen: boolean) => void;
  title: string;
}>;

const CollapsedSection = ({ children, title, id, isOpen, openSection }: CollapsedSectionProps) => {
  return (
    <li className={styles.section} id={id}>
      <div className={styles.head}>
        <div className={styles.bullet}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            focusable="false"
            aria-hidden="true"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.172 7 6.808 1.636 8.222.222 16 8l-7.778 7.778-1.414-1.414L12.172 9H0V7h12.172Z"
              fill="var(--text-inverted-blue-france)"
            />
          </svg>
        </div>
        <h2 className={cx(styles.title, "text-lg", "md:text-2xl")}>{title}</h2>
        <button onClick={_ => openSection(id, !!isOpen)} className={styles.button}>
          <span className={cx(styles.icon, isOpen ? "fr-icon-arrow-up-s-line" : "fr-icon-arrow-down-s-line")} />
          <span className="fr-sr-only">{isOpen ? "Fermer la section" : "Ouvrir la section"}</span>
        </button>
      </div>

      <div className={cx(!isOpen ? styles.hiddenContent : styles.content)}>{children}</div>
    </li>
  );
};
