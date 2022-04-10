import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserInfo } from "./interfaces";

const baseURL = "https://twiki.csc.depauw.edu/api";

// -------------------------- APIS

export const postAuthInfo = async () => {
  try {
    await axios.post(
      "https://twiki.csc.depauw.edu/api/auth",
      {},
      {
        headers: {
          authorization: await auth().currentUser!.getIdToken(),
        },
      },
    );
  } catch (e) {
    console.warn(e);
  }
};

export const postFilterGetMatching = async (userInfo: UserInfo) => {
  return await axios.post("https://twiki.csc.depauw.edu/api/matching", userInfo, {
    headers: {
      authorization: await auth().currentUser!.getIdToken(),
    },
  });
};

export const getAllConversations = async () => {
  try {
    return (
      await axios.get(`https://twiki.csc.depauw.edu/api/conversations`, {
        headers: {
          authorization: await auth().currentUser!.getIdToken(),
        },
      })
    ).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getAllMessagesByConversationId = async (id: number) => {
  try {
    return (
      await axios.get(`https://twiki.csc.depauw.edu/api/conversations/${id}`, {
        headers: {
          authorization: await auth().currentUser!.getIdToken(),
        },
      })
    ).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getProfile = async () => {
  try {
    return (
      await axios.get("https://twiki.csc.depauw.edu/api/profile", {
        headers: {
          authorization: await auth().currentUser!.getIdToken(),
        },
      })
    ).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getOptionsInfo = async () => {
  try {
    return (await axios.get("https://twiki.csc.depauw.edu/api/options-info")).data;
  } catch (e) {
    console.warn(e);
  }
};

export const postUserInfo = async (userInfo: any) => {
  return await axios.post("https://twiki.csc.depauw.edu/api/profile/update", userInfo, {
    headers: {
      authorization: await auth().currentUser!.getIdToken(),
    },
  });
};

export const getMatchings = async () => {
  try {
    return (
      await axios.get("https://twiki.csc.depauw.edu/api/matching", {
        headers: {
          authorization: await auth().currentUser!.getIdToken(),
        },
      })
    ).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getMatchingPreferencesData = async () => {
  try {
    return (
      await axios.get("https://twiki.csc.depauw.edu/api/matching-preferences-data", {
        headers: {
          authorization: await auth().currentUser!.getIdToken(),
        },
      })
    ).data;
  } catch (e) {
    console.warn(e);
  }
};

export const getPreferences = async () => {
  try {
    await axios.get(`${baseURL}/matching-preferences-data?debug=1`).then(result => {
      console.log(result.data);
    });
  } catch (e) {
    console.warn(e);
  }
};

// -------------------------- FUNCTIONS

export const signInWithGoogle = async () => {
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
};

export const signOut = async () => {
  await auth().signOut();
  await GoogleSignin.signOut();
  await AsyncStorage.removeItem("uid");
};

export const getStorage = async (key: string) => {
  try {
    return JSON.parse((await AsyncStorage.getItem(key)) || "null");
  } catch (e) {}
};

export const setStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};
