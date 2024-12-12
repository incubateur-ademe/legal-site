import { type FrIconClassName } from "@codegouvfr/react-dsfr";
import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";

import { isBrowser } from "@/utils/browser";

import { type TextColorStyle } from "../utils/color-styles";
import { IconStyleJsx } from "./client/IconStyleJsx";
import styles from "./Icon.module.scss";

export type IconProps = {
  className?: CxArg;
  color?: TextColorStyle;
  icon: FrIconClassName;
  onClick?: () => void;
  /**
   * @default sm
   */
  size?: "lg" | "sm" | "xl" | "xs";
  title?: string;
} & (IconProps.WithoutText | IconProps.WithText);

export namespace IconProps {
  export interface WithText {
    /**
     * @default left
     */
    align?: "center" | "left" | "right" | "space-around" | "space-between" | "space-evenly";
    /**
     * @default left
     */
    iconPosition?: "left" | "right";
    text: string;
    textColor?: TextColorStyle;
    valign?: "bottom" | "top";
  }

  export interface WithoutText {
    align?: never;
    iconPosition?: never;
    text?: never;
    textColor?: never;
    valign?: never;
  }
}

/**
 * Icon component, based on DSFR's Icon css component.
 */
export const Icon = ({
  icon,
  onClick,
  color,
  size = "sm",
  className,
  text,
  iconPosition = "left",
  valign,
  align = "left",
  textColor,
  ...rest
}: IconProps) => (
  <span
    {...rest}
    role={onClick ? "button" : "img"}
    {...(isBrowser
      ? {}
      : {
          style: {
            ...(color && {
              "--icon-color": `var(--${color})`,
            }),
            ...(textColor && {
              color: `var(--${textColor})`,
            }),
          } as React.CSSProperties,
        })}
    onClick={onClick}
    onKeyDown={onClick}
    className={cx(
      icon,
      styles["fr-icon"],
      size && styles[`fr-icon--${size}`],
      onClick && styles["fr-icon--clickable"],
      iconPosition && styles[`fr-icon--${iconPosition}`],
      valign && styles[`fr-icon--valign-${valign}`],
      align && styles[`fr-icon--align-${align}`],
      className,
    )}
    aria-hidden={text ? "false" : "true"}
  >
    {isBrowser && <IconStyleJsx color={color} textColor={textColor} />}
    {text && <>{text}</>}
  </span>
);
