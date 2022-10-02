import React, { useCallback, useContext, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-paper";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/interfaces";
import { AuthContext } from "../contexts/AuthContext";
import { DefaultStyles } from "../App";
import { CustomText, HideKeyboard, mainColor } from "../utils/components";
import Accordion from "../components/Accordion";
import HeaderTitle from "../components/HeaderTitle";

const ProfileEdit = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "ProfileEdit">>();
  const route = useRoute<RouteProp<RootStackParamList, "ProfileEdit">>();

  const { userInfo } = useContext(AuthContext);
  const [openingAccordionCategory, setOpeningAccordionCategory] = useState<string>("");
  const [majors, setMajors] = useState<string[]>(route.params.majors);
  const [greek, setGreek] = useState<string[]>(route.params.greek);
  const [programs, setPrograms] = useState<string[]>(route.params.programs);
  const [hobbies, setHobbies] = useState<string[]>(route.params.hobbies);
  const [bio, setBio] = useState<string>(route.params.bio);

  const onApplyPress = useCallback(() => {
    const newUserInfo = {
      ...userInfo,
      majors,
      greek,
      programs,
      hobbies,
      bio,
    };
    navigation.navigate("Profile", { newUserInfo });
  }, [majors, greek, programs, hobbies, bio]);

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: () => <HeaderTitle name="Edit" /> });
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.8} onPress={onApplyPress}>
          <CustomText
            style={{
              textTransform: "capitalize",
              color: mainColor,
            }}>
            Apply
          </CustomText>
        </TouchableOpacity>
      ),
    });
  }, [majors, greek, programs, hobbies, bio]);

  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView bounces={false} contentContainerStyle={[DefaultStyles.Container, styles.container]}>
        <View style={{ width: "100%", alignItems: "flex-end", marginBottom: 20 }}>
          <HideKeyboard>
            <TextInput
              style={styles.bio}
              placeholder="Add bio"
              placeholderTextColor="#aaa"
              maxLength={200}
              onChangeText={text => setBio(text)}
              value={bio}
              theme={{ colors: { text: "#fff" }, roundness: 20, mode: "adaptive" }}
              activeUnderlineColor="transparent"
              underlineColor="transparent"
              selectionColor={mainColor}
              multiline
            />
          </HideKeyboard>
          <Text style={{ color: "#aaa" }}>{bio.length}/200</Text>
        </View>

        <Accordion
          category="Majors"
          optionsKey="majors"
          accordionData={majors}
          setAccordionData={setMajors}
          openingAccordion={openingAccordionCategory}
          setOpeningAccordion={setOpeningAccordionCategory}
          limit={2}
          first
        />
        <Accordion
          category="Greek"
          optionsKey="greek"
          accordionData={greek}
          setAccordionData={setGreek}
          openingAccordion={openingAccordionCategory}
          setOpeningAccordion={setOpeningAccordionCategory}
          limit={1}
        />
        <Accordion
          category="Programs"
          optionsKey="programs"
          accordionData={programs}
          setAccordionData={setPrograms}
          openingAccordion={openingAccordionCategory}
          setOpeningAccordion={setOpeningAccordionCategory}
          limit={2}
        />
        <Accordion
          category="Hobbies"
          optionsKey="hobbies"
          accordionData={hobbies}
          setAccordionData={setHobbies}
          openingAccordion={openingAccordionCategory}
          setOpeningAccordion={setOpeningAccordionCategory}
          limit={3}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileEdit;

const styles = StyleSheet.create({
  bio: {
    backgroundColor: "transparent",
    color: "#fff",
    textAlignVertical: "top",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: mainColor,
    width: "100%",
    paddingHorizontal: 8,
  },
  container: {
    alignItems: "center",
    marginHorizontal: 20,
  },
});
