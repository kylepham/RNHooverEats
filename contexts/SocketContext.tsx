import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { Client } from "@stomp/stompjs";
import { ConversationInterface, MessageInterface } from "../utils/interfaces";

export interface SocketContextProps {
  client?: any;
  socketConnected: boolean;
  conversationDict: { [key: string]: MessageInterface[] };
  setConversationDict?: Dispatch<SetStateAction<{ [key: string]: MessageInterface[] }>>;
  conversations: Array<ConversationInterface> | null;
  setConversations?: Dispatch<SetStateAction<Array<ConversationInterface> | null>>;
}

export interface SocketProviderProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
}

export const SocketContext = createContext<SocketContextProps>({
  socketConnected: false,
  conversationDict: {},
  conversations: null,
});

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { userInfo } = useContext(AuthContext);

  const [client, setClient] = useState<any>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [conversationDict, setConversationDict] = useState<{
    [key: string]: MessageInterface[];
  }>({});
  const [conversations, setConversations] = useState<Array<ConversationInterface> | null>(null);
  const value = {
    client,
    socketConnected,
    conversationDict,
    setConversationDict,
    conversations,
    setConversations,
  };

  // initiate websocket
  useEffect(() => {
    if (!Object.keys(userInfo).length) return;

    if (!client) {
      let helper = new Client({
        brokerURL: "wss://twiki.csc.depauw.edu/ws",
        connectHeaders: {},
        debug: console.log,
        appendMissingNULLonIncoming: true,
        logRawCommunication: true,
        forceBinaryWSFrames: true,
        onConnect: async () => {
          setSocketConnected(true);
          helper.subscribe("/user/" + userInfo.uid + "/queue/messages", ({ body }) => {
            const socketBody = JSON.parse(body);
            const {
              conversationId,
              senderUid,
              senderName,
              senderPhotoUrl,
              recipientUid,
              recipientName,
              recipientPhotoUrl,
              content,
              timestamp,
            } = socketBody;

            setConversationDict(dict => {
              if (dict[conversationId]) {
                const messages = [...dict[conversationId]];
                if (messages.filter(message => message.id === socketBody.id).length === 0) {
                  messages.push(socketBody);
                  dict[conversationId] = messages;
                }
              }
              return { ...dict };
            });

            setConversations(conversations => {
              let conversation = conversations!.filter(
                conversation => conversation.conversationId === conversationId,
              )[0];
              if (!conversation) {
                if (senderUid === userInfo.uid) {
                  conversation = {
                    conversationId,
                    recipientUid: recipientUid,
                    recipientPhotoUrl: recipientPhotoUrl,
                    recipientName: recipientName,
                    timestamp,
                    text: content,
                    lastSenderName: senderName,
                  };
                } else {
                  conversation = {
                    conversationId,
                    recipientUid: senderUid,
                    recipientPhotoUrl: senderPhotoUrl,
                    recipientName: senderName,
                    timestamp,
                    text: content,
                    lastSenderName: senderName,
                  };
                }
                conversations!.push(conversation);
              } else {
                conversation.timestamp = timestamp;
                conversation.text = content;
                conversation.lastSenderName = senderName;
              }

              return [...conversations!.sort((prev, next) => next.timestamp - prev.timestamp)];
            });
          });
        },
        reconnectDelay: 10000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      setClient(helper);
    }
  }, [userInfo]);

  useEffect(() => {
    if (client) client.activate();
  }, [client]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
