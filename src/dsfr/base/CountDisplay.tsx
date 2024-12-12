import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";
import { type ReactNode } from "react";

import styles from "./CountDisplay.module.css";

type BaseCountDisplayProps = {
  className?: string;
  classes?: Partial<Record<"content" | "count" | "description" | "legend" | "max" | "root" | "text", string>>;
  count: number | string;
  legend?: NonNullable<ReactNode>;
  noBorder?: boolean;
  /**
   * @default "large"
   */
  size?: "large" | "small";
  text: NonNullable<ReactNode>;
};

type LargeCountDisplayProps = BaseCountDisplayProps & {
  max?: number;
  size?: "large";
};

type SmallCountDisplayProps = BaseCountDisplayProps & {
  max?: never;
  size?: "small";
};

export type CountDisplayProps = LargeCountDisplayProps | SmallCountDisplayProps;

export const CountDisplay = ({
  count: note,
  noBorder,
  max,
  text,
  className,
  size = "large",
  legend,
  classes = {},
}: CountDisplayProps) => (
  <div
    className={cx(
      size === "small" ? styles["tile-small"] : styles.tile,
      noBorder && styles["tile-no-border"],
      classes.root,
      className,
    )}
  >
    <div className={styles["tile-count"]}>
      <span className={cx(size === "small" ? styles["count-small"] : styles.count, classes.count)}>{note}</span>
      {size === "large" && typeof max === "number" && (
        <span className={cx(styles.max, classes.max)}>&nbsp;/&nbsp;{max}</span>
      )}
    </div>
    <div className={cx(styles["tile-content"], classes.content)}>
      <p className={cx(fr.cx("fr-m-0"), styles.text, classes.text)}>{text}</p>
      {legend && (
        <p className={cx(fr.cx("fr-m-0", "fr-text--sm"), classes.legend)}>
          <i>{legend}</i>
        </p>
      )}
    </div>
  </div>
);
