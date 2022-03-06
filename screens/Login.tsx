import React from "react";
import { Dimensions, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DefaultStyles } from "../App";
import AntDesign from "react-native-vector-icons/AntDesign";
import { signInWithGoogle } from "../utils";
import { darkColor } from "../utils/components";

const Login = () => {
  return (
    <View style={[DefaultStyles.Container]}>
      <StatusBar backgroundColor={darkColor} barStyle="light-content" />
      <SafeAreaView style={[DefaultStyles.Container, styles.container]}>
        <Image source={require("../assets/logo.png")} style={styles.appLogo} resizeMethod="resize" />
        <TouchableOpacity activeOpacity={0.8} style={styles.loginButton} onPress={signInWithGoogle}>
          <AntDesign name="google" color={TEXT_COLOR} size={height / 25} style={styles.loginButtonIcon} />
          <Text style={styles.loginButtonText}>Login with Google</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default Login;

const { width, height } = Dimensions.get("window");
const TEXT_COLOR = "#de4d41";
const BUTTON_COLOR = "#ffe7ea";
const BUTTON_HEIGHT = height / 15;

const styles = StyleSheet.create({
  appLogo: {
    resizeMode: "contain",
    width: width * 0.8,
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: darkColor,
    height,
  },
  loginButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BUTTON_COLOR,
    height: BUTTON_HEIGHT,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButtonIcon: {
    marginRight: 20,
  },
  loginButtonText: {
    color: "#de4d41",
    fontSize: height / 40,
    fontWeight: "bold",
  },
});
