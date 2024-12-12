import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { useAnalyticsId } from "@codegouvfr/react-dsfr/tools/useAnalyticsId";
import { type ComponentPropsWithRef, type ReactNode } from "react";

import styles from "./SingleCheckbox.module.scss";

export interface SingleCheckboxProps {
  label?: ReactNode;
  nativeInputProps: ComponentPropsWithRef<"input">;
  small?: boolean;
}

export const SingleCheckbox = ({ label, small = false, nativeInputProps }: SingleCheckboxProps) => {
  const id = useAnalyticsId({
    defaultIdPrefix: `fr-single-checkbox-${nativeInputProps.name === undefined ? "" : `-${nativeInputProps.name}`}`,
    explicitlyProvidedId: nativeInputProps.id,
  });

  return (
    <>
      <input
        {...nativeInputProps}
        type="checkbox"
        id={id}
        className={cx(
          styles["fr-single-checkbox"],
          small && styles["fr-single-checkbox--sm"],
          nativeInputProps.className,
        )}
      />
      {label && (
        <label htmlFor={id} className="fr-sr-only">
          {label}
        </label>
      )}
    </>
  );
};
