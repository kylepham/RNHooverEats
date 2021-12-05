import React, { useContext, useState } from "react";
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DefaultStyles } from "../App";

import AntDesign from "react-native-vector-icons/AntDesign";
import { postUserInfo, signOut } from "../utils";
import { AuthContext } from "../contexts/AuthContext";
import { CustomButton, CustomText, darkColor, HideKeyboard, mainColor, SolidTextBox } from "../utils/components";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";

interface DescriptionField {
  type: string;
  limit: number;
}

const Profile = () => {
  const { userInfo, setUserInfo, optionsInfo } = useContext(AuthContext);
  const [visible, setVisible] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");

  const years = ["Freshman", "Sophomore", "Junior", "Senior", "Faculty"];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const numericYearCollegeYearConvert = (year: string | number) => {
    if (year === -1) return "Faculty";
    if (year === "Faculty") return -1;
    if (typeof year === "number") {
      if (currentMonth > 6) {
        return years[3 - (year - currentYear - 1)];
      } else {
        return years[3 - (year - currentYear)];
      }
    } else {
      let index = years.indexOf(year);
      if (currentMonth > 6) {
        return 3 - index + currentYear + 1;
      } else {
        return 3 - index + currentYear;
      }
    }
  };

  const removeFieldData = ({ type, val }: { type: string; val: string }) => {
    const list = userInfo[type];
    const index = list.indexOf(val);
    if (index !== -1) {
      list.splice(index, 1);
    }
    setUserInfo!({ ...userInfo, field: list });
  };

  const addFieldData = ({ type, val }: { type: string; val: string }) => {
    const list = userInfo[type];
    if (list && !list.includes(val)) {
      list.push(val);
    }
    setUserInfo!({ ...userInfo, field: list });
    setVisible(false);
  };

  const tryPostUserInfo = () => {
    setShowLoader(true);
    postUserInfo(userInfo).then(response => {
      if (response.status === 200) {
        setTimeout(() => setShowLoader(false), 1000);
      }
    });
  };

  const DescriptionField = ({ type, limit }: DescriptionField) => {
    const userValue = userInfo[type];
    return (
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          flexDirection: "row",
          alignItems: "center",
          margin: 15,
          flexWrap: "wrap",
        }}>
        <CustomText
          style={{
            fontSize: 16,
            fontWeight: "bold",
            textTransform: "uppercase",
            marginVertical: 8,
          }}>
          {type}:
        </CustomText>
        {userValue &&
          userValue.map((val: string) => {
            return (
              <SolidTextBox key={val} style={{ marginLeft: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
                  {val}
                  <CustomText onPress={() => removeFieldData({ type, val })}> &times; </CustomText>
                </Text>
              </SolidTextBox>
            );
          })}
        {userValue.length < limit && optionsInfo && (
          <Ionicons
            name={"add-circle"}
            color={mainColor}
            size={25}
            style={{ marginLeft: 5 }}
            onPress={() => {
              setSelectedType(type);
              setVisible(true);
            }}
          />
        )}
      </ScrollView>
    );
  };
  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView bounces={false} contentContainerStyle={[DefaultStyles.Container]}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: 150,
            }}>
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 60,
                overflow: "hidden",
              }}
              source={{ uri: userInfo.photoUrl }}
            />
            <CustomText
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                flexWrap: "wrap",
                marginVertical: 10,
              }}>
              {userInfo.name}
            </CustomText>
            <SolidTextBox>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: "black" }}>
                {numericYearCollegeYearConvert(userInfo?.gradYear)}
              </Text>
            </SolidTextBox>
          </View>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 20,
            }}>
            <HideKeyboard>
              <TextInput
                multiline={true}
                placeholder="Add bio"
                placeholderTextColor="grey"
                style={styles.bio}
                maxLength={200}
                onChangeText={text => setUserInfo!({ ...userInfo, bio: text })}
                value={userInfo.bio}
              />
            </HideKeyboard>
            <CustomText style={{ alignSelf: "flex-end", fontSize: 12 }}>{userInfo.bio.length}/200</CustomText>
          </View>
        </View>

        <CustomText
          style={{
            marginTop: 15,
            marginLeft: 15,
            fontWeight: "bold",
            fontSize: 20,
            textTransform: "uppercase",
          }}>
          Describe yourself:
        </CustomText>

        <DescriptionField type="majors" limit={2} />
        <DescriptionField type="greek" limit={1} />
        <DescriptionField type="programs" limit={2} />
        <DescriptionField type="hobbies" limit={3} />

        <Portal>
          <Modal
            visible={visible}
            onDismiss={() => setVisible(false)}
            contentContainerStyle={{
              backgroundColor: mainColor,
              borderRadius: 15,
              height: "50%",
              width: "80%",
              alignSelf: "center",
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedType &&
                optionsInfo![selectedType].map((val: string) => {
                  return (
                    <TouchableOpacity
                      key={val}
                      activeOpacity={0.8}
                      style={{
                        borderBottomColor: darkColor,
                        borderBottomWidth: 1,
                        marginHorizontal: 13,
                      }}
                      onPress={() => addFieldData({ type: selectedType, val })}>
                      <Text
                        style={{
                          color: "black",
                          overflow: "visible",
                          borderStyle: "solid",
                          padding: 10,
                        }}>
                        {val}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </Modal>
        </Portal>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <ActivityIndicator animating={false} color={mainColor} />
          <CustomButton
            onPress={tryPostUserInfo}
            style={{
              display: "flex",
              alignItems: "center",
              alignSelf: "center",
              margin: 30,
              width: "40%",
            }}>
            <Text style={{ fontWeight: "bold", marginVertical: 3, color: "#000" }}>UPDATE</Text>
          </CustomButton>
          <ActivityIndicator animating={showLoader} color={mainColor} />
        </View>

        <CustomButton onPress={signOut} style={styles.signOutButton}>
          <AntDesign name="logout" size={20} color="black" style={{ marginRight: 5 }} />
          <Text style={{ color: "#000", fontWeight: "bold" }}>SIGN OUT</Text>
        </CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  signOutButton: {
    display: "flex",
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    width: "40%",
    backgroundColor: "red",
  },
  bio: {
    backgroundColor: "white",
    color: "black",
    textAlignVertical: "top",
    borderRadius: 15,
    height: 150,
    width: 200,
    alignSelf: "center",
    paddingHorizontal: 8,
  },
});
