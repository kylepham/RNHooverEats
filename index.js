/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "26063172720-rdr53at36ngq7q66n01p24n8f1e6k29a.apps.googleusercontent.com",
});

AppRegistry.registerComponent(appName, () => App);
