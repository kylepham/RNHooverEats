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
import { CustomButton } from "../styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import { signOut } from "../utils";

const Settings = () => {
  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView
        bounces={false}
        contentContainerStyle={[DefaultStyles.Container, styles.container]}>
        <CustomButton onPress={signOut} style={styles.signOutButton}>
          <View style={{ marginRight: 40 }}>
            <AntDesign name="logout" size={20} color="black" />
          </View>
          Sign Out
        </CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  signOutButton: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
  },
});
