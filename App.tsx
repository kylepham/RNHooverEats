import React, { useContext, useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "./contexts/AuthContext";
import { SocketContext } from "./contexts/SocketContext";
import { getAllConversations, getProfile } from "./utils";
import { ConversationInterface, RootStackParamList } from "./utils/interfaces";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { darkColor, mainColor } from "./utils/components";
import Home from "./screens/Home";
import Conversations from "./screens/Conversations";
import Chat from "./screens/Chat";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import Loading from "./screens/Loading";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

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
            case "Home":
              return <Feather name="home" size={25} color={`${focused ? "#e4bb4a" : "#fffbf57f"}`} />;
            case "Conversations":
              return <MaterialIcons name="messenger-outline" size={25} color={`${focused ? "#e4bb4a" : "#fffbf57f"}`} />;
            case "Profile":
              return <AntDesign name="user" size={25} color={`${focused ? "#e4bb4a" : "#fffbf57f"}`} />;
          }
        },
        tabBarStyle: {
          backgroundColor: "black",
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Conversations" component={Conversations} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const ChatHeader: React.FC<{ recipientPhotoUrl: string; recipientName: string }> = ({ recipientPhotoUrl, recipientName }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
      }}>
      <Image source={{ uri: recipientPhotoUrl }} style={{ width: 35, height: 35, borderRadius: 40 }} />
      <Text style={{ color: "#fff", marginLeft: 20, fontWeight: "bold" }}>{recipientName}</Text>
    </View>
  );
};

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: darkColor,
  },
};

const App = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
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
        setUserInfo!(await getProfile());
      } else {
        setLoggedIn(false);
        setUserInfo!(null);
      }
    });
  }, []);

  useEffect(() => {
    if (userInfo && socketConnected) setLoggedIn(true);
  }, [userInfo, socketConnected]);

  if (loggedIn === null) return <Loading />;
  if (!loggedIn) return <Login />;

  return (
    <NavigationContainer theme={Theme}>
      <StatusBar barStyle={"light-content"} />
      <Stack.Navigator>
        <Stack.Screen name="TabNavigation" component={TabNavigation} options={{ headerShown: false }} />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={({ route }) => ({
            title: route.params.recipientName,
            headerStyle: { backgroundColor: darkColor },
            headerTintColor: mainColor,
            headerTitle: () => <ChatHeader recipientPhotoUrl={route.params.recipientPhotoUrl} recipientName={route.params.recipientName} />,
            headerBackTitle: undefined,
          })}
        />
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
