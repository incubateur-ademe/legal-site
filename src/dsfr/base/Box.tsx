import { fr } from "@codegouvfr/react-dsfr";
import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";
import { forwardRef, type PropsWithChildren } from "react";

import { buildSpacingClasses, type ResponsiveSpacingProps, type SpacingProps } from "../utils/spacing";

export type BoxProps = PropsWithChildren<
  React.HTMLAttributes<HTMLDivElement> &
    ResponsiveSpacingProps &
    SpacingProps & {
      as?: "article" | "aside" | "div" | "footer" | "header" | "main" | "p" | "section";
      className?: CxArg;
    }
>;

const boxProps = ({
  className,
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  m,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  p,
  // responsive props
  mtmd,
  mrmd,
  mbmd,
  mlmd,
  mxmd,
  mymd,
  mmd,
  ptmd,
  prmd,
  pbmd,
  plmd,
  pxmd,
  pymd,
  pmd,
  ...rest
}: Omit<BoxProps, "as">): React.HTMLAttributes<HTMLDivElement> => ({
  className: cx(
    fr.cx(
      buildSpacingClasses({
        mt,
        mr,
        mb,
        ml,
        mx,
        my,
        m,
        pt,
        pr,
        pb,
        pl,
        px,
        py,
        p,
        mtmd,
        mrmd,
        mbmd,
        mlmd,
        mxmd,
        mymd,
        mmd,
        ptmd,
        prmd,
        pbmd,
        plmd,
        pxmd,
        pymd,
        pmd,
      }),
    ),
    className,
  ),
  ...rest,
});

export const Box = ({ as: HtmlTag = "div", ...rest }: BoxProps) => <HtmlTag {...boxProps(rest)} />;
export const BoxRef = forwardRef<HTMLDivElement, BoxProps>(({ as: HtmlTag = "div", ...rest }, ref) => (
  <HtmlTag ref={ref} {...boxProps(rest)} />
));

BoxRef.displayName = "BoxRef";
