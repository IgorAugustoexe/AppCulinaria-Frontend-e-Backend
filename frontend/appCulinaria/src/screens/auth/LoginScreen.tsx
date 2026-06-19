import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppButton } from "../../components/AppButton";
import { InputData } from "../../components/InputData";
import { KeyboardAwareScreen } from "../../components/KeyboardAwareScreen";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../themes/colors";
import { layout } from "../../themes/dimensions";
import { globalStyles } from "../../styles/globalStyles";
import { registerRules } from "../../validations/authRules";
import { LoginInput } from "../../types/auth";
import { ShowPasswordButton } from "../../components/ShowPasswordButton";
import { setUserInfo } from "../../redux/reducers/UserReducer";
import { authApi } from "../../api/authApi";
import { getApiErrorMessage } from "../../config/axios";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const [loadingAuth, setLoadingAuth] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(true);

  const { control, clearErrors, handleSubmit } = useForm<LoginInput>({
    shouldFocusError: false,
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSignIn = async (data: LoginInput) => {
    try {
      setLoadingAuth(true);
      const user = await authApi.login(data);
      dispatch(
        (setUserInfo as any)({
          userId: user.id,
          name: user.nome,
          userName: user.login,
          authToken: user.token,
        }),
      );
    } catch (error) {
      navigation.navigate("ModalInfo", {
        title: "Não foi possível entrar",
        message: getApiErrorMessage(error),
      });
    } finally {
      setLoadingAuth(false);
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
        placeholder="Digite sua senha"
        secureTextEntry={showPassword}
        rules={registerRules.password}
        iconName="lock"
      />
      <ShowPasswordButton showPassword={showPassword} setShowPassword={setShowPassword} />
      <AppButton title="Entrar" loading={loadingAuth} onPress={handleSubmit(handleSignIn)} />
      <TouchableOpacity
        style={styles.signUpBtn}
        onPress={() => navigation.navigate("Register")}
        activeOpacity={0.7}
        disabled={loadingAuth}
        hitSlop={15}
      >
        <Text style={styles.signUpText}>Cadastre-se</Text>
      </TouchableOpacity>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  signUpBtn: {
    marginTop: layout.windowWidth / 20,
    alignSelf: "center",
  },
  signUpText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
  },
});
