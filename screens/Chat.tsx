import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DefaultStyles } from "../App";
import { CustomText } from "../styles";

const Chat = () => {
  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView>
        <CustomText>Hello Chat</CustomText>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Chat;

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({});
