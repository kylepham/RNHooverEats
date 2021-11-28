import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "https://twiki.csc.depauw.edu/api";

// -------------------------- APIS

export const getPreferences = async () => {
  try {
    await axios
      .get(`${baseURL}/matching-preferences-data?debug=1`)
      .then(result => {
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
  await AsyncStorage.removeItem("loggedIn");
};
