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
export const darkColor = "#161512";

// -------------------------- COMPONENTS

interface TextProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
  style?: StyleProp<TextStyle>;
  [x: string]: any;
}

export const CustomText = ({ children, style, ...rest }: TextProps) => {
  return (
    <Text style={[{ color: "#fff" }, style]} {...rest}>
      {children}
    </Text>
  );
};

interface ButtonProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
  onPress: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  [x: string]: any;
}

export const CustomButton = ({ children, style, ...rest }: ButtonProps) => {
  return (
    <TouchableOpacity
      {...rest}
      activeOpacity={0.8}
      style={[
        {
          backgroundColor: mainColor,
          padding: 10,
          borderRadius: 7,
        },
        style,
      ]}>
      <Text style={{ color: "#000", fontSize: 17 }}>{children}</Text>
    </TouchableOpacity>
  );
};
