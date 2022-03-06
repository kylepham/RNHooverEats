import React, { useContext, useEffect, useState } from "react";
import { StatusBar, StyleSheet, Text } from "react-native";
import "react-native-reanimated";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "./contexts/AuthContext";
import { SocketContext } from "./contexts/SocketContext";
import { getAllConversations, getOptionsInfo, getProfile, postAuthInfo } from "./utils";
import { ConversationInterface, RootStackParamList } from "./utils/interfaces";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { darkColor, mainColor } from "./utils/components";
import Home from "./screens/Home";
import Filter from "./screens/Filter";
import Conversations from "./screens/Conversations";
import Chat from "./screens/Chat";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import Loading from "./screens/Loading";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: darkColor,
  },
};

const HomeNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={({ route }) => ({
        headerTitle: () => (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              textTransform: "uppercase",
              color: mainColor,
            }}>
            {route.name}
          </Text>
        ),
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: darkColor,
        },
        headerBackTitleVisible: false,
        headerTintColor: mainColor,
        headerShadowVisible: false,
      })}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Filter" component={Filter} />
    </Stack.Navigator>
  );
};

const TabNavigation = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: () => (
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              textTransform: "uppercase",
              color: mainColor,
            }}>
            {route.name}
          </Text>
        ),
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: darkColor,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          marginBottom: 3,
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarActiveTintColor: mainColor,
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case "HomeNavigation":
              return <Feather name="home" size={25} color={`${focused ? "#e4bb4a" : "#fffbf57f"}`} />;
            case "Conversations":
              return (
                <MaterialIcons name="messenger-outline" size={25} color={`${focused ? "#e4bb4a" : "#fffbf57f"}`} />
              );
            case "Profile":
              return <AntDesign name="user" size={25} color={`${focused ? "#e4bb4a" : "#fffbf57f"}`} />;
          }
        },
        tabBarStyle: {
          backgroundColor: "black",
        },
      })}>
      <Tab.Screen name="HomeNavigation" component={HomeNavigation} options={{ headerShown: false, title: "Home" }} />
      <Tab.Screen name="Conversations" component={Conversations} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const App = () => {
  const { userInfo, setUserInfo, setOptionsInfo } = useContext(AuthContext);
  const { setConversations, socketConnected } = useContext(SocketContext);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // get user login status
    (async () => {
      let value = await AsyncStorage.getItem("uid");
      if (value) {
        value = JSON.parse(value);
        if (!value) setLoggedIn(false);
      }
    })();

    // firebase auth
    return auth().onAuthStateChanged(async user => {
      if (user) {
        await AsyncStorage.setItem("uid", JSON.stringify(user.uid));
        setConversations!(
          (await getAllConversations()).sort((prev: ConversationInterface, next: ConversationInterface) => {
            return next.timestamp - prev.timestamp;
          }),
        );
        postAuthInfo().then(async () => {
          setUserInfo!(await getProfile());
        });
        setOptionsInfo!(await getOptionsInfo());
      } else {
        setLoggedIn(false);
        setUserInfo!({});
        setOptionsInfo!({});
      }
    });
  }, []);

  useEffect(() => {
    if (Object.keys(userInfo) && socketConnected) setLoggedIn(true);
  }, [userInfo, socketConnected]);

  if (loggedIn === null) return <Loading />;
  if (!loggedIn) return <Login />;

  return (
    <NavigationContainer theme={Theme}>
      <StatusBar barStyle={"light-content"} />
      <Stack.Navigator>
        <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

export const DefaultStyles = StyleSheet.create({
  Container: {
    display: "flex",
  },
});
