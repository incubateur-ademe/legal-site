import { fr } from "@codegouvfr/react-dsfr";

import styles from "./InitialsAvatar.module.scss";

export interface InitialsAvatarProps {
  name: string;
  size?: number;
}

export const InitialsAvatar = ({ name }: InitialsAvatarProps) => {
  const initials = getInitials(name);
  const background = generateBackground(name);
  return (
    <div className={styles["initials-avatar"]} style={{ backgroundColor: background[0], color: background[1] }}>
      <span>{initials}</span>
    </div>
  );
};

function generateBackground(name: string) {
  const bgColors = Object.values(fr.colors.decisions.background.flat).map(color => color.default);
  const fgColors = Object.values(fr.colors.decisions.background.contrast).map(color => color.default);

  const initials = getInitials(name);
  // Generate a number between 0 and the number of colors based on both initials
  const colorIndex = (initials.charCodeAt(0) + initials.charCodeAt(1)) % bgColors.length;
  return [bgColors[colorIndex], fgColors[colorIndex]];
}

function getInitials(name: string) {
  const splited = name.split(" ");
  return `${splited[0][0]}${splited[1][0]}`;
}
