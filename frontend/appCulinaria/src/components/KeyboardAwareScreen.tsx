import React from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { layout } from "../themes/dimensions";

type KeyboardAwareScreenProps = {
  children: any;
  contentContainerStyle?: StyleProp<ViewStyle>;
  extraHeight?: number;
  extraScrollheight?: number;
};

export function KeyboardAwareScreen({
  children,
  contentContainerStyle,
  extraHeight = 100,
  extraScrollheight = 160,
}: KeyboardAwareScreenProps) {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableAutomaticScroll
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      extraHeight={extraHeight}
      extraScrollHeight={extraScrollheight}
      contentContainerStyle={[{ flexGrow: 1, paddingBottom: layout.windowWidth / 20 }, contentContainerStyle]}
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
