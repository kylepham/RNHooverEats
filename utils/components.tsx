// -------------------------- COLORS

export const mainColor = "#e4bb4a";
export const darkColor = "#161512";

// -------------------------- COMPONENTS

import React, { ReactChild, ReactChildren } from "react";
import {
    GestureResponderEvent,
    Keyboard,
    StyleProp,
    Text,
    TextStyle,
    TouchableOpacity,
    TouchableWithoutFeedback, View,
    ViewStyle,
} from "react-native";

/// TEXTS
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

export const SolidTextBox = ({ children, style, ...rest }: TextProps) => {
  return (
    <View
      style={[
        {
          backgroundColor: mainColor,
          borderRadius: 15,
          paddingHorizontal: 10,
          paddingVertical: 5,
          margin: 2
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
};

//BUTTONS

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
        {children}
    </TouchableOpacity>
  );
};

export const HideKeyboard = ({
  children,
}: {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
