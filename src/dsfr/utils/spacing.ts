import { type FrCxArg, type SpacingToken } from "@codegouvfr/react-dsfr";

import { type OmitStartsWith } from "@/utils/types";

export type SpacingProps = {
  m?: SpacingToken | "0" | "auto";
  mb?: SpacingToken | "0" | "auto";
  ml?: SpacingToken | "0" | "auto";
  mr?: SpacingToken | "0" | "auto";
  mt?: SpacingToken | "0" | "auto";
  mx?: SpacingToken | "0" | "auto";
  my?: SpacingToken | "0" | "auto";
  p?: SpacingToken | "0";
  pb?: SpacingToken | "0";
  pl?: SpacingToken | "0";
  pr?: SpacingToken | "0";
  pt?: SpacingToken | "0";
  px?: SpacingToken | "0";
  py?: SpacingToken | "0";
};

export type ResponsiveSpacingProps = {
  [P in keyof SpacingProps as `${P}${"md"}`]?: SpacingProps[P];
};

export const buildSpacingClasses = ({
  mt,
  mr,
  mb,
  ml,
  mx,
  my,
  pt,
  pr,
  pb,
  pl,
  px,
  py,
  m,
  p,
  // responsive props
  mtmd,
  mrmd,
  mbmd,
  mlmd,
  mxmd,
  mymd,
  ptmd,
  prmd,
  pbmd,
  plmd,
  pxmd,
  pymd,
  mmd,
  pmd,
}: ResponsiveSpacingProps & SpacingProps): FrCxArg => [
  mt && `fr-mt-${mt}`,
  mb && `fr-mb-${mb}`,
  ml && `fr-ml-${ml}`,
  mr && `fr-mr-${mr}`,
  mx && `fr-mx-${mx}`,
  my && `fr-my-${my}`,
  m && `fr-m-${m}`,
  pt && `fr-pt-${pt}`,
  pb && `fr-pb-${pb}`,
  pl && `fr-pl-${pl}`,
  pr && `fr-pr-${pr}`,
  px && `fr-px-${px}`,
  py && `fr-py-${py}`,
  p && `fr-p-${p}`,
  mtmd && `fr-mt-md-${mtmd}`,
  mbmd && `fr-mb-md-${mbmd}`,
  mlmd && `fr-ml-md-${mlmd}`,
  mrmd && `fr-mr-md-${mrmd}`,
  mxmd && `fr-mx-md-${mxmd}`,
  mymd && `fr-my-md-${mymd}`,
  mmd && `fr-m-md-${mmd}`,
  ptmd && `fr-pt-md-${ptmd}`,
  pbmd && `fr-pb-md-${pbmd}`,
  plmd && `fr-pl-md-${plmd}`,
  prmd && `fr-pr-md-${prmd}`,
  pxmd && `fr-px-md-${pxmd}`,
  pymd && `fr-py-md-${pymd}`,
  pmd && `fr-p-md-${pmd}`,
];

export type MarginProps = OmitStartsWith<ResponsiveSpacingProps & SpacingProps, "p">;
export type PaddingProps = OmitStartsWith<ResponsiveSpacingProps & SpacingProps, "m">;
