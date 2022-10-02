import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import notifee from "@notifee/react-native";
import { AuthContext } from "../contexts/AuthContext";
import { SocketContext } from "../contexts/SocketContext";
import { DefaultStyles } from "../App";
import { CustomButton, CustomText, darkColor, mainColor } from "../utils/components";
import { postFilterGetMatching } from "../utils";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { RootStackParamList, UserInfo } from "../utils/interfaces";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Modal, Portal, TextInput } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import HeaderTitle from "../components/HeaderTitle";

interface ProfileCardProps {
  user: UserInfo;
  numberOfMatches: number;
  [key: string]: any;
}

const ProfileCard = ({ user, numberOfMatches, ...rest }: ProfileCardProps) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.profileCardContainer} {...rest}>
      <View style={styles.profileCardHeader}>
        <Text numberOfLines={2} style={styles.profileCardName}>
          {user.name}
        </Text>
        <Text style={styles.profileCardMatchingBadge}>{`${numberOfMatches} match${
          numberOfMatches > 1 ? "es" : ""
        }`}</Text>
      </View>

      <View style={{ borderBottomWidth: 1, borderBottomColor: "#0000001e" }} />

      <View style={styles.profileCardBody}>
        <View style={styles.profileCardBodyLeft}>
          <Image source={{ uri: user.photoUrl }} style={styles.profileCardAvatar} />
          <Text style={{ fontSize: 10, color: "#000", textTransform: "uppercase" }}>{user.classes![0]}</Text>
        </View>

        <View style={styles.profileCardBodyRight}>
          <Text numberOfLines={2} style={styles.profileCardBio}>
            {user.bio || "No bio."}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Home = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Home">>();
  const route = useRoute<RouteProp<RootStackParamList, "Home">>();

  const { userInfo, setUserInfo } = useContext(AuthContext);
  const { client } = useContext(SocketContext);
  const [detailProfileVisible, setDetailProfileVisible] = useState<boolean>(false);
  const [chosenProfile, setChosenProfile] = useState<UserInfo | undefined>(undefined);
  const [matchingProfiles, setMatchingProfiles] = useState<Array<any> | undefined>(undefined);
  const [message, setMessage] = useState<string>(DEFAULT_TEXT_MESSAGE);

  const refreshMatchingProfiles = async (newUserInfo?: UserInfo) => {
    setMatchingProfiles(undefined);
    await postFilterGetMatching(newUserInfo || userInfo).then(response => {
      const { data } = response;
      if (data.length === 0) {
        setMatchingProfiles(undefined);
        return;
      }

      setMatchingProfiles(data);
    });
  };

  const onChangeTextMessage = (text: string) => {
    setMessage(text);
  };

  const sendMessage = (text: string, recipientUid: string) => {
    if (!text) return;

    const message = {
      senderUid: userInfo.uid,
      recipientUid,
      content: text,
      timestamp: new Date().getTime(),
    };

    client.publish({
      destination: "/app/chat",
      body: JSON.stringify(message),
    });

    setDetailProfileVisible(false);
  };

  useEffect(() => {
    (async () => {
      await refreshMatchingProfiles();
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <HeaderTitle name="Home" />,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={async () => {
              await refreshMatchingProfiles();
            }}>
            <CustomText>
              <AntDesign name="reload1" size={20} color={mainColor} />
            </CustomText>
          </TouchableOpacity>
        );
      },
    });
  }, [userInfo]);

  useEffect(() => {
    if (route.params?.newUserInfo) {
      setUserInfo!(route.params.newUserInfo);
      refreshMatchingProfiles(route.params.newUserInfo);
    }
  }, [route.params]);

  const displayNotification = async () => {
    // Create a channel
    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    // Display a notification
    await notifee.displayNotification({
      title: "Notification Title",
      body: "Main body content of the notification",
      android: {
        channelId,
      },
    });
  };

  return (
    <SafeAreaView style={[DefaultStyles.Container, { flex: 1 }]}>
      <View style={[DefaultStyles.Container, styles.container]}>
        <View style={styles.userTypeContainer}>
          <CustomButton onPress={displayNotification}>
            <Text>Notifee</Text>
          </CustomButton>
          <CustomText>You are</CustomText>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.userType}
            onPress={() => {
              navigation.navigate("Filter", {
                prefMajors: userInfo.prefMajors!,
                prefClasses: userInfo.prefClasses!,
                prefGreek: userInfo.prefGreek!,
                prefPrograms: userInfo.prefPrograms!,
                prefHobbies: userInfo.prefHobbies!,
                type: userInfo.type!,
              });
            }}>
            <View
              style={{
                flexDirection: "row",
                margin: 5,
                padding: 10,
                backgroundColor: mainColor,
                alignItems: "center",
                borderRadius: 10,
              }}>
              <Text
                style={{
                  color: "#000",
                  textTransform: "uppercase",
                  marginRight: 5,
                }}>
                {userInfo.type!}
              </Text>
              <AntDesign name="right" size={20} color="#000" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.matchingContainer}>
          <FlatList
            style={{ width: "100%", alignSelf: "center", paddingHorizontal: 50 }}
            data={matchingProfiles}
            renderItem={({ item }) => {
              const user = item.user;
              return (
                <ProfileCard
                  user={user}
                  numberOfMatches={item.reason.length}
                  onPress={() => {
                    setDetailProfileVisible(true);
                    setChosenProfile({ ...user, reason: item.reason });
                    setMessage(DEFAULT_TEXT_MESSAGE);
                  }}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            bounces={false}
            maxToRenderPerBatch={10}
          />
        </View>
      </View>

      <Portal>
        <Modal visible={detailProfileVisible} onDismiss={() => setDetailProfileVisible(false)}>
          <View style={{ alignSelf: "center", width: "80%", backgroundColor: "black" }}>
            {chosenProfile && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                contentContainerStyle={{
                  alignSelf: "center",
                  backgroundColor: mainColor,
                  borderRadius: 5,
                  width: "100%",
                  alignItems: "center",
                }}>
                <Image
                  source={{ uri: chosenProfile.photoUrl }}
                  style={{ width: 100, height: 100, borderRadius: 50, marginVertical: 20 }}
                />

                <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: "bold", color: "#000" }}>
                  {chosenProfile.name}
                </Text>

                <Text style={{ marginBottom: 20, marginHorizontal: 20, color: "#000" }}>
                  {chosenProfile.bio || "No bio."}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                    marginBottom: 20,
                  }}>
                  <View style={{ alignItems: "center", width: "40%", flexShrink: 1 }}>
                    <Text style={{ textTransform: "uppercase", fontWeight: "bold", color: "#000" }}>{`Major${
                      chosenProfile.majors!.length > 1 ? "s" : ""
                    }`}</Text>
                    <Text style={{ color: "#000", textAlign: "center" }}>
                      {chosenProfile.majors!.length >= 1 ? chosenProfile.majors!.join(", ") : "N/A"}
                    </Text>
                  </View>
                  <View style={{ alignItems: "center", width: "40%", flexShrink: 1 }}>
                    <Text style={{ textTransform: "uppercase", fontWeight: "bold", color: "#000" }}>Greek</Text>
                    <Text style={{ color: "#000", textAlign: "center" }}>
                      {chosenProfile.greek!.length >= 1 ? chosenProfile.greek!.join(", ") : "N/A"}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    width: "100%",
                    marginBottom: 20,
                  }}>
                  <View style={{ alignItems: "center", width: "40%", flexShrink: 1 }}>
                    <Text style={{ textTransform: "uppercase", fontWeight: "bold", color: "#000" }}>{`Program${
                      chosenProfile.programs!.length > 1 ? "s" : ""
                    }`}</Text>
                    <Text style={{ color: "#000", textAlign: "center" }}>
                      {chosenProfile.programs!.length >= 1 ? chosenProfile.programs!.join(", ") : "N/A"}
                    </Text>
                  </View>
                  <View style={{ alignItems: "center", width: "40%", flexShrink: 1 }}>
                    <Text style={{ textTransform: "uppercase", fontWeight: "bold", color: "#000" }}>{`${
                      chosenProfile.hobbies!.length > 1 ? "Hobbies" : "Hobby"
                    }`}</Text>
                    <Text style={{ color: "#000", textAlign: "center" }}>
                      {chosenProfile.hobbies!.length >= 1 ? chosenProfile.hobbies!.join(", ") : "N/A"}
                    </Text>
                  </View>
                </View>

                <View style={{ width: "100%", paddingHorizontal: 20, marginBottom: 20, justifyContent: "center" }}>
                  <TextInput
                    mode="flat"
                    numberOfLines={1}
                    defaultValue={DEFAULT_TEXT_MESSAGE}
                    onChangeText={onChangeTextMessage}
                    style={{ borderRadius: 20, backgroundColor: "darkgray", fontSize: 15 }}
                    selectionColor="#000"
                    activeUnderlineColor="#00000000"
                    underlineColor="#00000000"
                    theme={{ roundness: 20, colors: { text: "#000" } }}
                    right={
                      <TextInput.Icon
                        name={() => (
                          <TouchableOpacity
                            onPress={() => {
                              sendMessage(message, chosenProfile.uid!);
                            }}>
                            <FontAwesome name="send" size={20} color={!!message ? "#000" : "darkgray"} />
                          </TouchableOpacity>
                        )}
                      />
                    }
                    dense
                  />
                </View>
              </ScrollView>
            )}
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

export default Home;

const DEFAULT_TEXT_MESSAGE = "Hi! I would like to connect.";
const PROFILECARD_AVATAR_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  matchingContainer: {
    flex: 1,
    width: "100%",
  },
  profileCardAvatar: {
    width: PROFILECARD_AVATAR_SIZE,
    height: PROFILECARD_AVATAR_SIZE,
    borderRadius: PROFILECARD_AVATAR_SIZE / 2,
    borderWidth: 3,
    borderColor: mainColor,
  },
  profileCardBody: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  profileCardBodyLeft: {
    alignItems: "center",
    marginRight: 20,
  },
  profileCardBodyRight: {
    flexShrink: 1,
  },
  profileCardBio: {
    color: "#000",
  },
  profileCardContainer: {
    backgroundColor: "#DFE0DF",
    borderRadius: 20,
    marginVertical: 10,
    padding: 20,
  },
  profileCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  profileCardMatchingBadge: {
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 5,
    color: "#000",
    fontSize: 10,
    padding: 5,
  },
  profileCardName: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileCardInfoLine: {},
  userType: {},
  userTypeContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
});
