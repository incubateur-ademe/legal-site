import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type JSX, type PropsWithChildren, type ReactNode, useId } from "react";

import { type PropsWithoutChildren } from "@/utils/types";

import { Box } from "./Box";

export type FormFieldsetProps = {
  elements: ReactNode[];
  error?: ReactNode;
  hint?: ReactNode;
  legend: ReactNode;
  nativeFieldsetProps?: PropsWithoutChildren<JSX.IntrinsicElements["fieldset"]>;
  valid?: ReactNode;
};
export const FormFieldset = ({ hint, legend, elements, error, valid, nativeFieldsetProps }: FormFieldsetProps) => {
  const id = useId();
  const hasAssert = !!error || !!valid;
  const assertMessageId = `fr-fieldset-${id}-${error ? "error" : "valid"}`;

  return (
    <fieldset
      {...nativeFieldsetProps}
      role="group"
      className={fr.cx("fr-fieldset", !!error && "fr-fieldset--error", !!valid && "fr-fieldset--valid")}
      aria-labelledby={cx(`fr-fieldset-${id}-legend`, hasAssert && assertMessageId)}
    >
      <legend className={cx("fr-fieldset__legend")} id={`fr-fieldset-${id}-legend`}>
        {legend}
        {hint && <span className="fr-hint-text">{hint}</span>}
      </legend>
      {elements.map((element, index) => (
        <Box key={`fieldset__element-${index}`} className="fr-fieldset__element">
          {element}
        </Box>
      ))}
      {hasAssert && (
        <FormFieldsetMessageGroup id={assertMessageId} isValid={!!valid}>
          {error ?? valid}
        </FormFieldsetMessageGroup>
      )}
    </fieldset>
  );
};

interface FormFieldsetMessageGroupProps {
  id: string;
  isValid: boolean;
}
const FormFieldsetMessageGroup = ({ id, isValid, children }: PropsWithChildren<FormFieldsetMessageGroupProps>) => (
  <div className="fr-messages-group" id={id} aria-live="assertive">
    <p className={cx("fr-message", isValid ? "fr-message--valid" : "fr-message--error")}>{children}</p>
  </div>
);
