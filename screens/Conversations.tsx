import React, { useContext } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SocketContext } from "../contexts/SocketContext";
import { DefaultStyles } from "../App";
import { CustomText } from "../utils/components";
import { getAllMessagesByConversationId } from "../utils";
import { useNavigation } from "@react-navigation/core";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ConversationInterface, RootStackParamList } from "../utils/interfaces";

interface ConversationProps {
  conversation: ConversationInterface;
  [x: string]: any;
}

const Conversation = ({ conversation, ...rest }: ConversationProps) => {
  return (
    <TouchableOpacity {...rest} activeOpacity={0.8} style={styles.conversationContainer}>
      <Image
        source={{ uri: conversation.recipientPhotoUrl }}
        style={{
          width: 66,
          height: 66,
          borderRadius: 100,
          marginRight: 10,
          marginVertical: 10,
        }}
      />
      <View style={styles.conversationInfo}>
        <CustomText style={{ fontWeight: "bold" }}>{conversation.recipientName}</CustomText>
        <View style={styles.conversationTextTime}>
          <CustomText numberOfLines={1} style={{ flexShrink: 1 }}>
            {conversation.text}
          </CustomText>
          <CustomText> · </CustomText>
          <CustomText>
            {new Date(conversation.timestamp).toLocaleTimeString([], {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Conversations = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { conversationDict, setConversationDict, conversations } = useContext(SocketContext);

  const onConversationPress = async (conversation: ConversationInterface) => {
    if (conversationDict[conversation.conversationId])
      navigation.navigate("Chat", {
        recipientUid: conversation.recipientUid,
        recipientName: conversation.recipientName,
        recipientPhotoUrl: conversation.recipientPhotoUrl,
        conversationId: conversation.conversationId,
      });
    else {
      getAllMessagesByConversationId(conversation.conversationId).then(messages => {
        setConversationDict!({
          ...conversationDict,
          [conversation.conversationId]: messages,
        });
        navigation.navigate("Chat", {
          recipientUid: conversation.recipientUid,
          recipientName: conversation.recipientName,
          recipientPhotoUrl: conversation.recipientPhotoUrl,
          conversationId: conversation.conversationId,
        });
      });
    }
  };

  console.log("conversations:", conversations);
  console.log("convo dict:", conversationDict);

  return (
    <SafeAreaView style={DefaultStyles.Container}>
      <ScrollView bounces={false} contentContainerStyle={[DefaultStyles.Container, styles.container]}>
        {conversations &&
          conversations.map((conversation, index) => {
            return (
              <Conversation
                conversation={conversation}
                key={index}
                onPress={async () => onConversationPress(conversation)}
              />
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Conversations;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  conversationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  conversationInfo: {
    marginRight: 20,
    width: "100%",
  },
  conversationTextTime: {
    display: "flex",
    flexDirection: "row",
    maxWidth: width / 1.4,
  },
});
