import React from "react";
import { Dimensions, StatusBar, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Mi from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Home from "./screens/Home";
import Chat from "./screens/Chat";
import Settings from "./screens/Settings";

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle={"light-content"} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            switch (route.name) {
              case "Home":
                return (
                  <Feather
                    name="home"
                    size={25}
                    color={`${focused ? "#e4bb4a" : "#fffbf57f"}`}
                  />
                );
              case "Chat":
                return (
                  <Mi
                    name="messenger-outline"
                    size={25}
                    color={`${focused ? "#e4bb4a" : "#fffbf57f"}`}
                  />
                );
              case "Settings":
                return (
                  <AntDesign
                    name="user"
                    size={25}
                    color={`${focused ? "#e4bb4a" : "#fffbf57f"}`}
                  />
                );
            }
          },
          tabBarStyle: {
            backgroundColor: "black",
          },
        })}>
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const { height } = Dimensions.get("window");

export const DefaultStyles = StyleSheet.create({
  Container: {
    display: "flex",
    minHeight: height,
    backgroundColor: "#161512",
  },
});
