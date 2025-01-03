import { cx } from "@codegouvfr/react-dsfr/tools/cx";

import { Box, type BoxProps } from "@/dsfr";

export type ContainerProps = {
  size?: "lg" | "md" | "sm" | "xl";
} & (
  | (BoxProps & {
      fluid: true;
    })
  | (Omit<BoxProps, "ml" | "mr" | "mx" | "pl" | "pr" | "px"> & {
      fluid?: never;
    })
);

export const Container = ({ children, className, fluid, size, ...rest }: ContainerProps) => {
  let containerClass = "fr-container";
  if (size) containerClass += `-${size}`;
  if (fluid) containerClass += `--fluid`;
  return (
    <Box className={cx(className, containerClass)} {...rest}>
      {children}
    </Box>
  );
};
