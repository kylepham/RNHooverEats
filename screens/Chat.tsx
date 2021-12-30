import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { AuthContext } from "../contexts/AuthContext";
import {
  Composer,
  ComposerProps,
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
  GiftedChat,
  IMessage,
  Bubble,
  Time,
  TimeProps,
  BubbleProps,
  MessageTextProps,
  MessageText,
} from "react-native-gifted-chat";
import { RouteProp, useRoute } from "@react-navigation/native";
import { SocketContext } from "../contexts/SocketContext";
import { RootStackParamList } from "../utils/interfaces";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { darkColor, mainColor } from "../utils/components";

const Chat = () => {
  const route = useRoute<RouteProp<RootStackParamList>>();
  const { recipientUid, conversationId } = route.params!;
  const { userInfo } = useContext(AuthContext);
  const { client, conversationDict } = useContext(SocketContext);
  const [currentMessages, setCurrentMessages] = useState<IMessage[] | undefined>(undefined);
  const [text, setText] = useState<string>("");

  useEffect(() => {
    setCurrentMessages(
      conversationDict[conversationId]
        .map(message => {
          return {
            _id: message.id,
            text: message.content,
            createdAt: new Date(message.timestamp),
            user:
              userInfo!.uid === message.senderUid
                ? {
                    _id: 1,
                    name: message.senderName,
                    avatar: message.senderPhotoUrl,
                  }
                : {
                    _id: 2,
                    name: message.senderName,
                    avatar: message.senderPhotoUrl,
                  },
          };
        })
        .reverse(),
    );
  }, [conversationDict]);

  const sendMessage = ([{ text }]: IMessage[]) => {
    if (!text) return;

    const message = {
      senderUid: userInfo!.uid,
      recipientUid,
      content: text,
      timestamp: new Date().getTime(),
    };

    client.publish({
      destination: "/app/chat",
      body: JSON.stringify(message),
    });
  };

  const onInputTextChange = (text: string) => {
    setText(text);
  };

  const renderInputToolbar = (props: InputToolbarProps) => (
    <InputToolbar
      {...props}
    containerStyle={{
        backgroundColor: darkColor,
        borderTopWidth: 0,
    }}
    primaryStyle={{
        display: "flex",
        alignItems: "center",
    }}/>
  );

  const renderComposer = (props: ComposerProps) => (
    <Composer
      {...props}
      textInputStyle={{
        display: "flex",
        alignItems: "center",
        color: "white",
        backgroundColor: "#2c2d2e",
        borderRadius: 20,
        paddingTop: 8.5,
        paddingHorizontal: 10,
        height: "100%",
        fontSize: 15,
      }}
    />
  );

  const renderSend = (props: SendProps<IMessage>) => (
    <Send
      {...props}
      disabled={!props.text}
      containerStyle={{
        width: 44,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
      }}>
      <FontAwesome name="send" size={20} color={text.length ? mainColor : "grey"} />
    </Send>
  );

  const renderBubble = (props: BubbleProps<IMessage>) => {
    let previousMessageMinutesGap = 10,
      nextMessageMinutesGap = 10;
    if (props.currentMessage && props.previousMessage) {
      if (props.currentMessage.user?._id !== props.previousMessage.user?._id) previousMessageMinutesGap = 10;
      else
        previousMessageMinutesGap =
          (props.currentMessage?.createdAt?.valueOf() - props.previousMessage?.createdAt?.valueOf()) / 60 / 1000;
    }
    if (props.currentMessage && props.nextMessage) {
      if (props.currentMessage.user?._id !== props.nextMessage.user?._id) nextMessageMinutesGap = 10;
      else
        nextMessageMinutesGap =
          (props.nextMessage?.createdAt?.valueOf() - props.currentMessage?.createdAt?.valueOf()) / 60 / 1000;
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: mainColor,
            paddingVertical: 3,
            marginVertical: 0,
            borderTopLeftRadius: previousMessageMinutesGap > 2 ? 15 : 4,
            borderBottomLeftRadius: nextMessageMinutesGap > 2 ? 15 : 4,
            marginTop: previousMessageMinutesGap > 2 ? 8 : 0,
          },
          right: {
            backgroundColor: "#ffffffaf",
            paddingVertical: 3,
            marginVertical: 0,
            borderTopRightRadius: previousMessageMinutesGap > 2 ? 15 : 4,
            borderBottomRightRadius: nextMessageMinutesGap > 2 ? 15 : 4,
            marginTop: previousMessageMinutesGap > 2 ? 8 : 0,
          },
        }}
        renderTime={(props: TimeProps<IMessage>) => (
          <Time {...props} timeTextStyle={{ left: { color: "#0000007f" }, right: { color: "#0000007f" } }} />
        )}
        renderMessageText={(props: MessageTextProps<IMessage>) => (
          <MessageText {...props} textStyle={{ left: { color: "#000" }, right: { color: "#000" } }} />
        )}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return <AntDesign name="arrowdown" color={mainColor} size={20} />;
  };

  return (
    <GiftedChat
      messages={currentMessages}
      user={{ _id: 1 }}
      onSend={message => sendMessage(message)}
      onInputTextChanged={onInputTextChange}
      placeholder="Aa"
      renderInputToolbar={renderInputToolbar}
      renderComposer={renderComposer}
      renderSend={renderSend}
      renderBubble={renderBubble}
      scrollToBottomComponent={scrollToBottomComponent}
      scrollToBottomStyle={{
        position: "absolute",
        alignSelf: "center",
        left: width / 2 - 20,
        bottom: 10,
        width: 40,
        height: 40,
        backgroundColor: "#404040",
        borderColor: "#ffffff7f",
      }}
      alwaysShowSend
      scrollToBottom
    />
  );
};

export default Chat;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({});
