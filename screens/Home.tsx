import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import React from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { DefaultStyles } from "../App";
import { CustomText } from "../utils/components";

const Home = () => {
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView
        bounces={false}
        contentContainerStyle={[DefaultStyles.Container, styles.container, { paddingBottom: tabBarHeight }]}>
        <CustomText>Hello Home</CustomText>
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
