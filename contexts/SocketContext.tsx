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
import { getStorage } from "../utils";

interface SocketContextProps {
  client: any;
  socketConnected: boolean;
  recipientUid: string;
  setRecipientUid: Dispatch<SetStateAction<string>>;
  recipientName: string;
  setRecipientName: Dispatch<SetStateAction<string>>;
  conversationId: number;
  setConversationId: Dispatch<SetStateAction<number>>;
  conversationDict: Object;
  setConversationDict: Dispatch<SetStateAction<Object>>;
  currentMessages: Object;
  setCurrentMessages: Dispatch<SetStateAction<Object>>;
  conversations: Array<Object>;
  setConversations: Dispatch<SetStateAction<Array<Object>>>;
  hasNewMessageInBackground: boolean;
  setHasNewMessageInBackground: Dispatch<SetStateAction<boolean>>;
}

interface SocketProviderProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
}

export const SocketContext = createContext<SocketContextProps | null>(null);

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { userInfo } = useContext(AuthContext);

  const [client, setClient] = useState<any>(null);
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [recipientUid, setRecipientUid] = useState<string>("");
  const [recipientName, setRecipientName] = useState<string>("");
  const [conversationId, setConversationId] = useState<number>(0);
  const [conversationDict, setConversationDict] = useState<Object>({});
  const [currentMessages, setCurrentMessages] = useState<Object>({});
  const [conversations, setConversations] = useState<Array<Object>>([]);
  const [hasNewMessageInBackground, setHasNewMessageInBackground] =
    useState<boolean>(false);
  const value = {
    client,
    socketConnected,
    recipientUid,
    setRecipientUid,
    recipientName,
    setRecipientName,
    conversationId,
    setConversationId,
    conversationDict,
    setConversationDict,
    currentMessages,
    setCurrentMessages,
    conversations,
    setConversations,
    hasNewMessageInBackground,
    setHasNewMessageInBackground,
  };

  // initiate websocket
  useEffect(() => {
    if (!userInfo) return;

    let helper = new Client({
      brokerURL: "wss://twiki.csc.depauw.edu/ws",
      connectHeaders: {},
      debug: console.log,
      appendMissingNULLonIncoming: true,
      logRawCommunication: true,
      forceBinaryWSFrames: true,
      onConnect: async () => {
        setSocketConnected(true);
        helper.subscribe(
          "/user/" + userInfo.uid + "/queue/messages",
          ({ body }) => {
            body = JSON.parse(body);
            console.log(body);
          },
        );
      },
      reconnectDelay: 10000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    setClient(helper);
  }, [userInfo]);

  useEffect(() => {
    if (client) client.activate();
  }, [client]);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
