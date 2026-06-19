import { StyleSheet } from "react-native";
import { colors } from "../themes/colors";
import { layout } from "../themes/dimensions";

export const globalStyles = StyleSheet.create({
  authScreensContainer: {
    flex: 1,
    justifyContent: "center",
    padding: layout.windowWidth / 16,
  },
  errorText: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.danger,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});
