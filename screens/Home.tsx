import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
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
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView
        bounces={false}
        contentContainerStyle={[
          DefaultStyles.Container,
          styles.container,
          { paddingBottom: tabBarHeight },
        ]}>
        <CustomText>Hello Home</CustomText>
        <CustomButton onPress={e => console.log(e.nativeEvent)}>
          Test
        </CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
