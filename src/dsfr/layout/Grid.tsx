import { fr } from "@codegouvfr/react-dsfr";
import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";
import { forwardRef, type PropsWithChildren } from "react";

import { Box, BoxRef } from "@/dsfr";
import { type OmitStartsWith } from "@/utils/types";

import { type MarginProps, type PaddingProps } from "../utils/spacing";

type MarginPropsVertical = OmitStartsWith<MarginProps, "ml" | "mr" | "mx">;

export type GridProps = PropsWithChildren<
  MarginPropsVertical & {
    align?: "center" | "left" | "right";
    className?: CxArg;
    haveGutters?: boolean;
    valign?: "bottom" | "middle" | "top";
  }
>;

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ children, haveGutters, align, valign, className, ...rest }, ref) => (
    <BoxRef
      className={cx(
        fr.cx(
          "fr-grid-row",
          haveGutters && "fr-grid-row--gutters",
          align && `fr-grid-row--${align}`,
          valign && `fr-grid-row--${valign}`,
        ),
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </BoxRef>
  ),
);

Grid.displayName = "Grid";

export type ColsNumberType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type GridColProps = MarginPropsVertical &
  PaddingProps &
  PropsWithChildren & {
    base?: ColsNumberType | `${ColsNumberType}`;
    className?: CxArg;
    lg?: ColsNumberType | `${ColsNumberType}`;
    md?: ColsNumberType | `${ColsNumberType}`;
    offset?: ColsNumberType | `${ColsNumberType}`;
    offsetLg?: ColsNumberType | `${ColsNumberType}`;
    offsetMd?: ColsNumberType | `${ColsNumberType}`;
    offsetRight?: ColsNumberType | `${ColsNumberType}`;
    offsetRightLg?: ColsNumberType | `${ColsNumberType}`;
    offsetRightMd?: ColsNumberType | `${ColsNumberType}`;
    offsetRightSm?: ColsNumberType | `${ColsNumberType}`;
    offsetRightXl?: ColsNumberType | `${ColsNumberType}`;
    offsetSm?: ColsNumberType | `${ColsNumberType}`;
    offsetXl?: ColsNumberType | `${ColsNumberType}`;
    sm?: ColsNumberType | `${ColsNumberType}`;
    xl?: ColsNumberType | `${ColsNumberType}`;
  };

export const GridCol = ({
  base = 12,
  sm,
  md,
  lg,
  xl,
  offset,
  offsetLg,
  offsetMd,
  offsetSm,
  offsetXl,
  offsetRight,
  offsetRightLg,
  offsetRightMd,
  offsetRightSm,
  offsetRightXl,
  className,
  children,
  ...rest
}: GridColProps) => (
  <Box
    className={cx(
      fr.cx(
        base && `fr-col-${base}`,
        sm && `fr-col-sm-${sm}`,
        md && `fr-col-md-${md}`,
        lg && `fr-col-lg-${lg}`,
        xl && `fr-col-xl-${xl}`,
        offset && `fr-col-offset-${offset}`,
        offsetSm && `fr-col-offset-sm-${offsetSm}`,
        offsetMd && `fr-col-offset-md-${offsetMd}`,
        offsetLg && `fr-col-offset-lg-${offsetLg}`,
        offsetXl && `fr-col-offset-xl-${offsetXl}`,
        offsetRight && `fr-col-offset-${offsetRight}--right`,
        offsetRightSm && `fr-col-offset-sm-${offsetRightSm}--right`,
        offsetRightMd && `fr-col-offset-md-${offsetRightMd}--right`,
        offsetRightLg && `fr-col-offset-lg-${offsetRightLg}--right`,
        offsetRightXl && `fr-col-offset-xl-${offsetRightXl}--right`,
      ),
      className,
    )}
    {...rest}
  >
    {children}
  </Box>
);
