import Tag, { type TagProps } from "@codegouvfr/react-dsfr/Tag";
import { cx } from "@codegouvfr/react-dsfr/tools/cx";

import { type TemplateType, TemplateTypeShortName } from "@/lib/model/Template";

import style from "./TemplateTypeTag.module.scss";

export type TemplateTypeTagProps = {
  isNew?: boolean;
  type: TemplateType;
} & (
  | {
      disabled: boolean;
      linkProps?: never;
    }
  | {
      disabled?: never;
      linkProps?: TagProps.AsAnchor["linkProps"];
    }
);

export const TemplateTypeTag = ({ isNew, type, linkProps, disabled }: TemplateTypeTagProps) => {
  const props = disabled
    ? ({
        nativeButtonProps: {
          disabled,
        },
      } as TagProps)
    : ({
        linkProps: linkProps ?? { href: `#` },
      } as TagProps);
  return (
    <Tag {...props} className={cx(style["template-type-tag"], isNew && style.new, disabled && style.disabled)} small>
      {TemplateTypeShortName[type]}
      {isNew && <span className={style["new-indicator"]}>&nbsp;*</span>}
    </Tag>
  );
};
