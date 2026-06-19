import React, { Fragment } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { Controller } from "react-hook-form";
import { colors } from "../themes/colors";
import { globalStyles } from "../styles/globalStyles";
import { layout } from "../themes/dimensions";
import { AppIcon } from "./AppIcon";

type InputDataProps = TextInputProps & {
  control: any;
  name: any;
  clearErrors: any;
  inputTitle?: string;
  placeholder: string;
  rules?: any;
  keyboardType?: any;
  secureTextEntry?: boolean;
  containerStyle?: any;
  inputStyle?: any;
  iconName?: string;
  maxLength?: number;
  showMaxLength?: boolean;
  inputRef?: any;
};

export function InputData({
  control,
  name,
  clearErrors,
  inputTitle,
  placeholder,
  rules,
  keyboardType = "default",
  secureTextEntry = false,
  containerStyle,
  inputStyle,
  iconName,
  maxLength,
  showMaxLength,
  inputRef,
  ...textInputProps
}: InputDataProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {inputTitle && (
        <View style={styles.container}>
          <Text style={styles.titleInput}>{inputTitle}</Text>
        </View>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
          <Fragment>
            <View style={[styles.input, error && styles.inputError]}>
              <TextInput
                {...textInputProps}
                style={[styles.textInput, iconName ? styles.textInputWithIcon : styles.textInputFull, inputStyle]}
                ref={(input): any => {
                  ref(input);
                  if (typeof inputRef === "function") {
                    inputRef(input);
                    return;
                  }
                  if (inputRef) inputRef.current = input;
                }}
                onChangeText={(text) => {
                  onChange(text);
                  error && clearErrors(name);
                  textInputProps.onChangeText?.(text);
                }}
                value={value}
                onFocus={(event) => {
                  textInputProps.onFocus?.(event);
                }}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                maxLength={maxLength}
                numberOfLines={textInputProps.numberOfLines ?? 1}
                placeholderTextColor={colors.placeHolderTextColor}
              />
              {iconName && <AppIcon name={iconName} size={layout.windowWidth / 18} />}
            </View>
            <View style={styles.inputFooter}>
              <Text style={[globalStyles.errorText, { color: error ? colors.danger : "transparent" }]}>
                {error?.message ?? " "}
              </Text>
              {showMaxLength && <Text style={styles.characterCounter}>{`${value.length}/${maxLength}`}</Text>}
            </View>
          </Fragment>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  titleContainer: {
    marginBottom: 5,
  },
  titleInput: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textSecondary,
  },
  input: {
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    color: colors.textPrimary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: colors.backgroundInput,
  },
  inputError: {
    borderColor: colors.danger,
  },
  textInput: {
    color: colors.textPrimary,
  },
  textInputFull: {
    width: "100%",
  },
  textInputWithIcon: {
    width: "90%",
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8,
    marginTop: 2,
  },
  characterCounter: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
