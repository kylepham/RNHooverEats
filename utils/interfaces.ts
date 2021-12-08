export type RootStackParamList = {
  TabNavigation: undefined;
  Chat: {
    recipientUid: string;
    recipientName: string;
    recipientPhotoUrl: string;
    conversationId: number;
  };
};

export interface ConversationInterface {
  conversationId: number;
  lastSenderName: string;
  recipientName: string;
  recipientPhotoUrl: string;
  recipientUid: string;
  text: string;
  timestamp: number;
}

export interface MessageInterface {
  id: number;
  senderUid: string;
  senderName: string;
  senderPhotoUrl: string;
  recipientUid: string;
  recipientName: string;
  recipientPhotoUrl: string;
  content: string;
  timestamp: number;
  conversationId: number;
}
