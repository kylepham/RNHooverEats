import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { Dispatch, SetStateAction, useCallback, useContext } from "react";
import { MotiScrollView, motify } from "moti";
import { Chip } from "react-native-paper";
import Feather from "react-native-vector-icons/Feather";
import { mainColor } from "../utils/components";
import { OptionsInfo } from "../utils/interfaces";
import { AuthContext } from "../contexts/AuthContext";

const MotifiedFeather = motify(Feather)();

interface AccordionProps {
  category: string;
  optionsKey: keyof OptionsInfo;
  accordionData: string[];
  setAccordionData: Dispatch<SetStateAction<string[]>>;
  openingAccordion: string;
  setOpeningAccordion: Dispatch<SetStateAction<string>>;
  limit?: number;
  first?: boolean;
}

const Accordion = ({
  category,
  optionsKey,
  accordionData,
  setAccordionData,
  openingAccordion,
  setOpeningAccordion,
  limit,
  first,
}: AccordionProps) => {
  const { optionsInfo } = useContext(AuthContext);

  const onAccordionPress = useCallback(() => {
    if (openingAccordion === category) setOpeningAccordion("");
    else setOpeningAccordion(category);
  }, [openingAccordion, category]);

  const onItemPress = useCallback(
    (choiceName: string) => {
      if (accordionData.includes(choiceName)) {
        setAccordionData(accordionData.filter(data => data != choiceName));
      } else setAccordionData([...accordionData, choiceName]);
    },
    [accordionData],
  );

  return (
    <View style={[styles.accordionContainer, first ? { borderTopWidth: 2, borderTopColor: mainColor } : {}]}>
      <TouchableOpacity activeOpacity={0.8} style={styles.accordionHeader} onPress={onAccordionPress}>
        <View style={styles.accordionHeaderLeft}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>{category} </Text>
            {accordionData.length != 0 && (
              <Text style={{ color: "#fff", fontSize: 15 }}>- {accordionData.length} selected</Text>
            )}
          </View>
          {limit && <Text style={{ color: "#fff", fontSize: 10 }}>(up to {limit})</Text>}
        </View>

        <View style={styles.accordionHeaderRight}>
          <TouchableOpacity
            activeOpacity={accordionData.length === 0 ? 1 : 0.8}
            style={{ marginRight: 20 }}
            onPress={() => {
              setAccordionData([]);
            }}>
            <Text style={{ color: accordionData.length === 0 ? "#555" : "#fff" }}>Clear</Text>
          </TouchableOpacity>
          <MotifiedFeather
            animate={{ rotateZ: openingAccordion === category ? "90deg" : "0deg" }}
            transition={{ type: "timing", duration: 300 }}
            name="chevron-right"
            color="#fff"
          />
        </View>
      </TouchableOpacity>

      <MotiScrollView
        animate={{ maxHeight: openingAccordion === category ? height / 2 : 0 }}
        transition={{ type: "timing", duration: 400 }}
        bounces={false}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.accordionBody]}>
        {optionsInfo[optionsKey]!.map(choiceName => {
          const chosen = accordionData.includes(choiceName);
          const isChoosingMax = limit ? accordionData.length === limit : false;

          return (
            <TouchableOpacity
              key={choiceName}
              activeOpacity={isChoosingMax ? 1 : 0.8}
              style={[styles.accordionItemContainer]}
              onPress={() => {
                if (isChoosingMax && !chosen) return;
                onItemPress(choiceName);
              }}>
              <Chip
                style={[
                  styles.accordionItem,
                  {
                    backgroundColor: chosen ? mainColor : "transparent",
                    borderColor: isChoosingMax && !chosen ? "#555" : mainColor,
                  },
                ]}>
                <Text style={{ color: isChoosingMax && !chosen ? "#555" : !chosen ? "#fff" : "#000" }}>
                  {choiceName}
                </Text>
              </Chip>
            </TouchableOpacity>
          );
        })}
      </MotiScrollView>
    </View>
  );
};

export default Accordion;

const { height } = Dimensions.get("window");
const CATEGORY_HEIGHT = 50;

const styles = StyleSheet.create({
  accordionBody: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 20,
  },
  accordionContainer: {
    width: "100%",
    alignItems: "center",
    flexDirection: "column",
    borderBottomWidth: 2,
    borderBottomColor: mainColor,
  },
  accordionHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: CATEGORY_HEIGHT,
    borderRadius: 10,
    // paddingHorizontal: 20,
  },
  accordionHeaderLeft: {
    flexDirection: "column",
  },
  accordionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  accordionItem: {
    // borderColor: mainColor,
    borderWidth: 1,
  },
  accordionItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
});
