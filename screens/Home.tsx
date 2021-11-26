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
import { CustomButton, CustomText } from "../styles";

const Home = () => {
  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView bounces={false}>
        <CustomText>Hello Home</CustomText>
        <CustomButton onPress={e => console.log(e.nativeEvent)}>
          Test
        </CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({});
