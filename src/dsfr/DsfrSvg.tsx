import { cx, type CxArg } from "@codegouvfr/react-dsfr/tools/cx";

interface DsfrSvgProps {
  className?: CxArg;
  height: number;
  href: string;
  svgId: string;
  width: number;
}

export const DsfrSvg = ({ height, href, svgId, width, className }: DsfrSvgProps) => (
  <svg className={cx("dsfr-svg", "fr-fluid-img", className)} width={width} height={height}>
    <use href={`${href}#${svgId}`}></use>
  </svg>
);
