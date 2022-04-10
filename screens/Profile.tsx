import React, { useContext, useEffect } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DefaultStyles } from "../App";
import AntDesign from "react-native-vector-icons/AntDesign";
import { postUserInfo, signOut } from "../utils";
import { AuthContext } from "../contexts/AuthContext";
import { CustomButton, CustomText, mainColor } from "../utils/components";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/interfaces";
import HeaderTitle from "../components/HeaderTitle";

interface SectionProps {
  title: string;
  content: string;
}

const Section = ({ title, content }: SectionProps) => {
  return (
    <View style={{ width: "100%", marginBottom: 5 }}>
      <Text style={{ color: "#aaa", marginBottom: 5 }}>{title}</Text>
      <Text style={{ color: "#fff", fontSize: 15 }}>{content || "N/A"}</Text>
    </View>
  );
};

const Separator = () => {
  return <View style={styles.separator} />;
};

const NewProfile = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "ProfileEdit">>();
  const route = useRoute<RouteProp<RootStackParamList, "Profile">>();
  const { userInfo, setUserInfo } = useContext(AuthContext);

  useEffect(() => {
    navigation.setOptions({ headerTitle: () => <HeaderTitle name="Profile" /> });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate("ProfileEdit", {
                majors: userInfo.majors!,
                greek: userInfo.greek!,
                programs: userInfo.programs!,
                hobbies: userInfo.hobbies!,
                bio: userInfo.bio!,
              });
            }}>
            <CustomText
              style={{
                textTransform: "capitalize",
                color: mainColor,
              }}>
              Edit
            </CustomText>
          </TouchableOpacity>
        );
      },
    });
  }, [userInfo]);

  useEffect(() => {
    if (route.params?.newUserInfo) {
      setUserInfo!(route.params.newUserInfo);
      postUserInfo(route.params.newUserInfo);
    }
  }, [route.params]);

  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView bounces={false} contentContainerStyle={[DefaultStyles.Container, styles.container]}>
        <Image source={{ uri: userInfo.photoUrl }} style={styles.avatar} />
        <Text style={styles.bio}>{userInfo.bio ? userInfo.bio : "No bio."}</Text>

        <Section title="Name" content={userInfo.name!} />
        <Separator />
        <Section title="Class" content={userInfo.classes![0]} />
        <Separator />
        <Section title="Majors" content={userInfo.majors!.join(", ")} />
        <Separator />
        <Section title="Greek" content={userInfo.greek!.join(", ")} />
        <Separator />
        <Section title="Programs" content={userInfo.programs!.join(", ")} />
        <Separator />
        <Section title="Hobbies" content={userInfo.hobbies!.join(", ")} />

        <CustomButton onPress={signOut} style={styles.signOutButton}>
          <AntDesign name="logout" size={20} color="black" style={{ marginRight: 5 }} />
          <Text style={{ color: "#000", fontWeight: "bold" }}>SIGN OUT</Text>
        </CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewProfile;

const { width } = Dimensions.get("window");
const PHOTO_SIZE = width / 4;

const styles = StyleSheet.create({
  avatar: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE,
    borderWidth: 5,
    borderColor: mainColor,
    marginVertical: 20,
  },
  bio: {
    color: "#fff",
    marginBottom: 20,
    flexShrink: 1,
    width: "100%",
  },
  container: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  separator: {
    borderColor: "#555",
    borderWidth: 0.5,
    marginBottom: 15,
    width: "100%",
  },
  signOutButton: {
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    width: "40%",
    backgroundColor: "red",
  },
});
