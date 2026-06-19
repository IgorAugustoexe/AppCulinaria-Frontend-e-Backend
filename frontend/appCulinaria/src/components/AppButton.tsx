import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { colors } from "../themes/colors";
import { AppIcon } from "./AppIcon";
import { layout } from "../themes/dimensions";

type AppButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  icon?: {
    name: string;
    color?: string;
    size?: number;
  };
  textStyle?: StyleProp<TextStyle>;
};

export function AppButton({
  title,
  loading = false,
  disabled = false,
  onPress,
  containerStyle,
  icon,
  textStyle,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      disabled={loading || disabled}
      style={[styles.container, containerStyle, (loading || disabled) && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <View style={styles.buttonTextContent}>
          {icon && <AppIcon name={icon.name} color={icon.color} size={layout.windowWidth / 22} />}
          <Text style={[styles.text, textStyle, icon && { marginLeft: 10 }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.7,
  },
  text: {
    color: colors.textButton,
    fontSize: 14,
    fontWeight: "bold",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonTextContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
