export type RootStackParamList = {
  TabNavigation: undefined;
  Chat: {
    recipientUid: string;
    recipientName: string;
    recipientPhotoUrl: string;
    conversationId: number;
  };
  Home: {
    newUserInfo?: UserInfo;
  };
  Filter: {
    prefMajors: string[];
    prefClasses: string[];
    prefGreek: string[];
    prefPrograms: string[];
    prefHobbies: string[];
    type: string;
  };
  Profile: {
    newUserInfo?: UserInfo;
  };
  ProfileEdit: {
    majors: string[];
    greek: string[];
    programs: string[];
    hobbies: string[];
    bio: string;
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

export interface UserInfo {
  bio?: string;
  classes?: string[];
  email?: string;
  gradYear?: number;
  greek?: string[];
  hobbies?: string[];
  majors?: string[];
  name?: string;
  photoUrl?: string;
  prefClasses?: string[];
  prefGreek?: string[];
  prefHobbies?: string[];
  prefMajors?: string[];
  prefPrograms?: string[];
  priorities?: {
    classes?: number;
    greek?: number;
    hobbies?: number;
    majors?: number;
    programs?: number;
  };
  programs?: string[];
  type?: string;
  uid?: string;
  username?: string;
}

export interface OptionsInfo {
  classes?: string[];
  majors?: string[];
  greek?: string[];
  hobbies?: string[];
  programs?: string[];
  type?: string[];
}
