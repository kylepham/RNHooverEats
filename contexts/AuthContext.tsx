import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactChildren,
  SetStateAction,
  useState,
} from "react";
interface KeySet {
  [key: string]: string[];
}
interface OptionsInfo extends KeySet {
  classes:string[]
  majors:string[]
  greek:string[]
  hobbies:string[]
  programs:string[],
}

interface AuthContextProps {
  userInfo?: any;
  setUserInfo?: Dispatch<SetStateAction<any>>;
  optionsInfo?: OptionsInfo | undefined;
  setOptionsInfo?: Dispatch<SetStateAction<OptionsInfo | undefined>>;
}

interface AuthProviderProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
}

export const AuthContext = createContext<AuthContextProps>({});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userInfo, setUserInfo] = useState(null);
  const [optionsInfo, setOptionsInfo] = useState<OptionsInfo | undefined>(undefined);
  const value = { userInfo, setUserInfo, optionsInfo, setOptionsInfo };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
