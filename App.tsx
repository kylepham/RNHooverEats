import React, { useContext, useEffect, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "./contexts/AuthContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { darkColor } from "./styles";
import Home from "./screens/Home";
import Chat from "./screens/Chat";
import Settings from "./screens/Settings";
import Login from "./screens/Login";
import Loading from "./screens/Loading";

const Tab = createBottomTabNavigator();
const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: darkColor,
  },
};
const App = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // get user login status
    (async () => {
      let value = await AsyncStorage.getItem("uid");
      if (value) {
        value = JSON.parse(value);
        if (value) setLoggedIn(true);
      } else setLoggedIn(false);
    })();

    // firebase auth
    const subscriber = auth().onAuthStateChanged(async user => {
      if (user) {
        await AsyncStorage.setItem("uid", JSON.stringify(user.uid));
        setLoggedIn(true);
        setUserInfo!(user);
      } else {
        setLoggedIn(false);
        setUserInfo!(null);
      }
    });
    return subscriber;
  }, []);

  console.log(userInfo);

  if (loggedIn === null) return <Loading />;
  if (loggedIn === false) return <Login />;

  return (
    <NavigationContainer theme={Theme}>
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
                  <MaterialIcons
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

export const DefaultStyles = StyleSheet.create({
  Container: {
    display: "flex",
  },
});
