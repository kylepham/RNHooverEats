import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { mainColor } from "../utils/components";

interface HeaderTitle {
  name: string;
}

const HeaderTitle = ({ name }: HeaderTitle) => {
  return (
    <Text
      style={{
        fontWeight: "bold",
        fontSize: 16,
        textTransform: "uppercase",
        color: mainColor,
      }}>
      {name}
    </Text>
  );
};

export default HeaderTitle;

const styles = StyleSheet.create({});
