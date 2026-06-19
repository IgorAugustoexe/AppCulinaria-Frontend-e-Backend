import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { globalStyles } from "../../styles/globalStyles";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { InputData } from "../../components/InputData";
import { AppButton } from "../../components/AppButton";
import { registerRules } from "../../validations/authRules";
import { KeyboardAwareScreen } from "../../components/KeyboardAwareScreen";
import { RegisterInput } from "../../types/auth";
import { setUserInfo } from "../../redux/reducers/UserReducer";
import { ShowPasswordButton } from "../../components/ShowPasswordButton";
import { colors } from "../../themes/colors";
import { authApi } from "../../api/authApi";
import { getApiErrorMessage } from "../../config/axios";

export default function RegisterScreen() {
  const [handleLoading, setHandleLoading] = useState<boolean>(false);
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState<boolean>(true);

  const { control, clearErrors, handleSubmit } = useForm<RegisterInput>({
    shouldFocusError: false,
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const handleSignUp = async (data: RegisterInput) => {
    try {
      setHandleLoading(true);

      const user = await authApi.register(data);

      dispatch(
        (setUserInfo as any)({
          userId: user.id,
          name: user.nome,
          userName: user.login,
          authToken: user.token,
        }),
      );
    } catch (error) {
      Alert.alert("Não foi possível cadastrar", getApiErrorMessage(error));
    } finally {
      setHandleLoading(false);
    }
  };

  return (
    <KeyboardAwareScreen
      contentContainerStyle={globalStyles.authScreensContainer}
      extraHeight={75}
      extraScrollheight={0}
    >
      <InputData
        control={control}
        clearErrors={clearErrors}
        name="name"
        inputTitle="Nome completo *"
        placeholder="Ex: Igor Augusto"
        rules={registerRules.name}
        iconName="userName"
      />
      <InputData
        control={control}
        clearErrors={clearErrors}
        name="username"
        inputTitle="Usuário *"
        placeholder="Digite seu usuário"
        rules={registerRules.login}
        iconName="user"
      />
      <InputData
        control={control}
        clearErrors={clearErrors}
        name="password"
        inputTitle="Senha *"
        placeholder="Mínimo de 6 caracteres"
        secureTextEntry={showPassword}
        rules={registerRules.password}
        iconName="lock"
      />
      <ShowPasswordButton showPassword={showPassword} setShowPassword={setShowPassword} />
      <AppButton
        title="Cadastrar"
        loading={handleLoading}
        containerStyle={styles.primaryButton}
        onPress={handleSubmit(handleSignUp)}
      />
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
  },
});
