import React, { useContext, useLayoutEffect, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/interfaces";
import { DefaultStyles } from "../App";
import { CustomText, mainColor } from "../utils/components";
import Accordion from "../components/Accordion";
import HeaderTitle from "../components/HeaderTitle";

const Filter = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Filter">>();
  const route = useRoute<RouteProp<RootStackParamList, "Filter">>();

  const { userInfo, optionsInfo } = useContext(AuthContext);
  const [openingAccordionCategory, setOpeningAccordionCategory] = useState<string>("");
  const [prefClasses, setPrefClasses] = useState<string[]>(route.params.prefClasses);
  const [prefMajors, setPrefMajors] = useState<string[]>(route.params.prefMajors);
  const [prefGreek, setPrefGreek] = useState<string[]>(route.params.prefGreek);
  const [prefPrograms, setPrefPrograms] = useState<string[]>(route.params.prefPrograms);
  const [prefHobbies, setPrefHobbies] = useState<string[]>(route.params.prefHobbies);
  const [type, setType] = useState(route.params.type);

  const onApplyPress = () => {
    const newUserInfo = {
      ...userInfo,
      prefMajors,
      prefClasses,
      prefGreek,
      prefPrograms,
      prefHobbies,
      type,
    };
    navigation.navigate("Home", { newUserInfo });
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerTitle: () => <HeaderTitle name="Filter" /> });
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
  }, [prefMajors, prefClasses, prefGreek, prefPrograms, prefHobbies, type]);

  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView bounces={false} contentContainerStyle={[DefaultStyles.Container, styles.container]}>
        <View style={{ width: "100%", flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
          {optionsInfo.type!.map(userType => {
            return (
              <TouchableOpacity activeOpacity={0.8} key={userType} onPress={() => setType(userType)}>
                <View
                  style={{ backgroundColor: userType === type ? mainColor : "#444444", padding: 10, borderRadius: 10 }}>
                  <Text
                    style={{
                      color: "#000",
                    }}>
                    {userType}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {type === "Giver" && (
          <React.Fragment>
            <Accordion
              category="Majors"
              optionsKey="majors"
              accordionData={prefMajors}
              setAccordionData={setPrefMajors}
              openingAccordion={openingAccordionCategory}
              setOpeningAccordion={setOpeningAccordionCategory}
              first
            />
            <Accordion
              category="Classes"
              optionsKey="classes"
              accordionData={prefClasses}
              setAccordionData={setPrefClasses}
              openingAccordion={openingAccordionCategory}
              setOpeningAccordion={setOpeningAccordionCategory}
            />
            <Accordion
              category="Greek"
              optionsKey="greek"
              accordionData={prefGreek}
              setAccordionData={setPrefGreek}
              openingAccordion={openingAccordionCategory}
              setOpeningAccordion={setOpeningAccordionCategory}
            />
            <Accordion
              category="Programs"
              optionsKey="programs"
              accordionData={prefPrograms}
              setAccordionData={setPrefPrograms}
              openingAccordion={openingAccordionCategory}
              setOpeningAccordion={setOpeningAccordionCategory}
            />
            <Accordion
              category="Hobbies"
              optionsKey="hobbies"
              accordionData={prefHobbies}
              setAccordionData={setPrefHobbies}
              openingAccordion={openingAccordionCategory}
              setOpeningAccordion={setOpeningAccordionCategory}
            />
          </React.Fragment>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Filter;

const { height } = Dimensions.get("window");
const CATEGORY_HEIGHT = 50;
const ITEM_HEIGHT = 50;

const styles = StyleSheet.create({
  accordionBody: {
    width: "100%",
    paddingHorizontal: 20,
  },
  accordionBodyItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: ITEM_HEIGHT,
  },
  accordionContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    flexDirection: "column",
  },
  accordionHeader: {
    width: "100%",
    backgroundColor: mainColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: CATEGORY_HEIGHT,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  accordionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    marginHorizontal: 16,
  },
});
