import { fr } from "@codegouvfr/react-dsfr";
import { type ReactNode } from "react";
import { PulseLoader } from "react-spinners";

export interface LoaderProps {
  color?: string;
  loading: boolean;
  size?: string;
  text: ReactNode;
}

export const Loader = ({
  loading,
  text,
  size = "1em",
  color = fr.colors.decisions.text.active.blueFrance.default,
}: LoaderProps) => (loading ? <PulseLoader size={size} color={color} /> : text);
