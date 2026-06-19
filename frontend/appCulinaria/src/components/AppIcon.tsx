import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { colors } from "../themes/colors";
import { icons } from "../themes/icons";

type AppIconProps = {
  name: string;
  size?: number;
  color?: string;
  style?: any;
};

export function AppIcon({ name, size = 20, color = colors.icon, style }: AppIconProps) {
  const icon = icons[name];

  if (!icon) {
    return null;
  }

  return <FontAwesomeIcon icon={icon} size={size} color={color} style={style} />;
}
