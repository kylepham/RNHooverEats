import React from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { DefaultStyles } from "../App";
import { CustomText } from "../styles";

const Settings = () => {
  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView bounces={false}>
        <CustomText>Hello Settings</CustomText>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({});
