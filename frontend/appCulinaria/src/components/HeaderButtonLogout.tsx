import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { resetUser } from "../redux/reducers/UserReducer";
import { AppIcon } from "./AppIcon";
import { registerModalCallback } from "../utils/modalCallBack";

export function HeaderButtonLogout() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("ModalInfo", {
          title: "Sair da conta",
          message: "Deseja realmente sair de sua conta?",
          btn1Txt: "Não",
          btn2Txt: "Sim",
          btn2CallBackId: registerModalCallback(() => dispatch(resetUser())),
        })
      }
      style={styles.container}
    >
      <AppIcon name="logout" size={22} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
