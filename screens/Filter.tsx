import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MotiScrollView, motify, AnimatePresence } from "moti";
import { AuthContext } from "../contexts/AuthContext";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/interfaces";
import { DefaultStyles } from "../App";
import { CustomText, darkColor, mainColor } from "../utils/components";
import AntDesign from "react-native-vector-icons/AntDesign";

interface CategoryProps {
  category: string;
  list: string[];
  accordionData: string[];
  setAccordionData: Dispatch<SetStateAction<string[]>>;
  openingAccordion: string;
  setOpeningAccordion: Dispatch<SetStateAction<string>>;
}

const MotifiedAntDesign = motify(AntDesign)();

const Accordion = ({
  category,
  list,
  accordionData,
  setAccordionData,
  openingAccordion,
  setOpeningAccordion,
}: CategoryProps) => {
  const onAccordionPress = () => {
    if (openingAccordion === category) setOpeningAccordion("");
    else setOpeningAccordion(category);
  };

  const onItemPress = (choiceName: string) => {
    if (accordionData.includes(choiceName)) {
      setAccordionData(accordionData.filter(data => data != choiceName));
    } else setAccordionData([...accordionData, choiceName]);
  };

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity activeOpacity={0.8} style={styles.accordionHeader} onPress={onAccordionPress}>
        <View style={styles.accordionHeaderLeft}>
          <CustomText style={{ fontSize: 17, color: "#000" }}>{category} · </CustomText>
          <CustomText style={{ color: "#000" }}>{accordionData.length} selected</CustomText>
        </View>
        <MotifiedAntDesign
          from={{ rotateZ: openingAccordion === category ? "90deg" : "0deg" }}
          transition={{ type: "timing", duration: 400 }}
          name="rightcircleo"
          size={20}
          color="#000"
        />
      </TouchableOpacity>

      <AnimatePresence>
        {openingAccordion === category && (
          <MotiScrollView
            from={{ maxHeight: 0 }}
            animate={{ maxHeight: height / 2 }}
            transition={{ type: "timing", duration: 400 }}
            exit={{ maxHeight: 0 }}
            bounces={false}
            nestedScrollEnabled={true}
            style={styles.accordionBody}>
            {list.map(choiceName => {
              const chosen = accordionData.includes(choiceName);

              return (
                <TouchableOpacity
                  key={choiceName}
                  activeOpacity={0.8}
                  style={styles.accordionBodyItemContainer}
                  onPress={() => {
                    onItemPress(choiceName);
                  }}>
                  <CustomText
                    key={choiceName}
                    style={{
                      flexShrink: 1,
                      paddingRight: 10,
                      textTransform: "uppercase",
                      color: chosen ? mainColor : "white",
                    }}>
                    {choiceName}
                  </CustomText>
                  <AntDesign name="check" size={30} color={chosen ? mainColor : darkColor} />
                </TouchableOpacity>
              );
            })}
          </MotiScrollView>
        )}
      </AnimatePresence>
    </View>
  );
};

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

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity activeOpacity={0.8} onPress={onApplyPress}>
          <CustomText
            style={{
              fontSize: 16,
              textTransform: "uppercase",
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
                <Text
                  style={{
                    color: "#000",
                    backgroundColor: userType === type ? mainColor : "#444444",
                    padding: 10,
                    borderRadius: 10,
                  }}>
                  {userType}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {type === "Giver" && (
          <React.Fragment>
            <Accordion
              category="Majors"
              list={optionsInfo.majors!}
              accordionData={prefMajors}
              setAccordionData={setPrefMajors}
              openingAccordion={openingAccordionCategory}
              setOpeningAccordion={setOpeningAccordionCategory}
            />
            <Accordion
              category="Classes"
              list={optionsInfo.classes!}
              accordionData={prefClasses}
              setAccordionData={setPrefClasses}
              openingAccordion={openingAccordionCategory}
              setOpeningAccordion={setOpeningAccordionCategory}
            />
            <Accordion
              category="Greek"
              list={optionsInfo.greek!}
              accordionData={prefGreek}
              setAccordionData={setPrefGreek}
              openingAccordion={openingAccordionCategory}
              setOpeningAccordion={setOpeningAccordionCategory}
            />
            <Accordion
              category="Programs"
              list={optionsInfo.programs!}
              accordionData={prefPrograms}
              setAccordionData={setPrefPrograms}
              openingAccordion={openingAccordionCategory}
              setOpeningAccordion={setOpeningAccordionCategory}
            />
            <Accordion
              category="Hobbies"
              list={optionsInfo.hobbies!}
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
  accordionBodyItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: ITEM_HEIGHT,
  },
});
