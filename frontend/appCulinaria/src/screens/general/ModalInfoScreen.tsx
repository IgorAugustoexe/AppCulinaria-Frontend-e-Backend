import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { layout } from "../../themes/dimensions";
import { colors } from "../../themes/colors";
import { executeModalCallback } from "../../utils/modalCallBack";

type navigation = {
  props: {
    title: string;
    message: string;
    btn1Txt?: string;
    btn2Txt?: string;
    btn2CallBackId?: string;
  };
};

const ModalInfoScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<navigation, "props">>();

  const { title, message, btn1Txt, btn2Txt, btn2CallBackId } = { ...route.params };

  const onPressLeft = () => {
    navigation.goBack();
  };

  const onPressRight = () => {
    executeModalCallback(btn2CallBackId);
    navigation.goBack();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <View style={styles.containerText}>
          <Text style={styles.titleText}>{title || "Erro"}</Text>
        </View>
        <View style={styles.containerText}>
          <Text style={styles.messageText}>
            {message || "Ocorreu um erro ao realizar esta operação, por favor verifique sua conexão e tente novamente"}
          </Text>
        </View>
        <View style={styles.containerOptions}>
          <TouchableOpacity onPress={onPressLeft} style={[styles.buttons, !btn2Txt && { width: "100%" }]}>
            <Text style={styles.optionsText}>{btn1Txt || "ok"}</Text>
          </TouchableOpacity>
          {btn2Txt && (
            <TouchableOpacity onPress={onPressRight} style={styles.buttons}>
              <Text style={styles.optionsText}>{btn2Txt}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default ModalInfoScreen;

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "rgba(0,0,0, 0.6)",
  },
  modalContainer: {
    width: layout.windowWidth / 1.2,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  containerImgTxt: {
    paddingTop: layout.windowWidth / 22,
    paddingBottom: layout.windowWidth / 19,
    alignItems: "center",
  },
  containerText: {
    justifyContent: "center",
    paddingHorizontal: layout.windowWidth / 20,
    paddingVertical: 10,
  },
  titleText: {
    color: colors.textPrimary,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  messageText: {
    color: colors.textPrimary,
    fontSize: 16,
    textAlign: "center",
  },
  containerOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionsText: {
    fontSize: 14,
    color: colors.primary,
    textTransform: "uppercase",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttons: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
  },
});
