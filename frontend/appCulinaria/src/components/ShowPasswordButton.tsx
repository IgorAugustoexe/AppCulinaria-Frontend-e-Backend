import React, { Dispatch, SetStateAction } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { AppIcon } from "./AppIcon";
import { colors } from "../themes/colors";
import { layout } from "../themes/dimensions";

type ShowPasswordButtonProps = {
  showPassword: boolean;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
};

export function ShowPasswordButton({ showPassword, setShowPassword }: ShowPasswordButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => setShowPassword((currentValue) => !currentValue)}
      style={styles.container}
      hitSlop={10}
    >
      <AppIcon
        name={showPassword ? "eyeSlash" : "eye"}
        color={colors.placeHolderTextColor}
        size={layout.windowWidth / 22}
      />
      <Text style={styles.text}>{showPassword ? "Mostrar" : "Ocultar"} Senha</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: layout.windowWidth / 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "flex-end",
    width: layout.windowWidth / 3,
  },
  text: {
    fontSize: 13,
    fontWeight: "bold",
    color: colors.textSecondary,
  },
});
