"use client";

import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";
import { type ReactNode, useState } from "react";

export interface HoverTogglerProps {
  as?: "div" | "span";
  className?: CxArg;
  hover: ReactNode;
  normal: ReactNode;
}

export const HoverToggler = ({ normal, hover, as: Component = "div", className }: HoverTogglerProps) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <Component onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} className={cx(className)}>
      {isHover ? hover : normal}
    </Component>
  );
};
