import React, { ReactChild, ReactChildren } from "react";
import {
  GestureResponderEvent,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

// -------------------------- COLORS

export const mainColor = "#e4bb4a";

// -------------------------- COMPONENTS

interface TextProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
  moreStyles?: StyleProp<TextStyle>;
  [x: string]: any;
}

export const CustomText = ({ children, moreStyles, ...rest }: TextProps) => {
  return (
    <Text style={[{ color: "#fff" }, moreStyles]} {...rest}>
      {children}
    </Text>
  );
};

interface ButtonProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
  onPress: (e: GestureResponderEvent) => void;
  moreStyles?: StyleProp<ViewStyle>;
  [x: string]: any;
}

export const CustomButton = ({
  children,
  moreStyles,
  ...rest
}: ButtonProps) => {
  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: mainColor,
          alignSelf: "flex-start",
          padding: 10,
          borderRadius: 7,
        },
        moreStyles,
      ]}>
      <Text style={{ color: "#000", fontSize: 17 }}>{children}</Text>
    </TouchableOpacity>
  );
};
