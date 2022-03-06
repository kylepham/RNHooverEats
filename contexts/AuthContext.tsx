import React, { createContext, Dispatch, ReactChild, ReactChildren, SetStateAction, useState } from "react";
import { OptionsInfo, UserInfo } from "../utils/interfaces";

interface AuthContextProps {
  userInfo: UserInfo;
  setUserInfo?: Dispatch<SetStateAction<UserInfo>>;
  optionsInfo: OptionsInfo;
  setOptionsInfo?: Dispatch<SetStateAction<OptionsInfo>>;
}

interface AuthProviderProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
}

export const AuthContext = createContext<AuthContextProps>({ userInfo: {}, optionsInfo: {} });

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [optionsInfo, setOptionsInfo] = useState<OptionsInfo>({});
  const value = { userInfo, setUserInfo, optionsInfo, setOptionsInfo };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
