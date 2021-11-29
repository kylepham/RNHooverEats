import React, {
  createContext,
  Dispatch,
  ReactChild,
  ReactChildren,
  SetStateAction,
  useState,
} from "react";

interface AuthContextProps {
  userInfo?: any;
  setUserInfo?: Dispatch<SetStateAction<any>>;
}

interface AuthProviderProps {
  children: ReactChild | ReactChildren | ReactChild[] | ReactChildren[];
}

export const AuthContext = createContext<AuthContextProps>({});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userInfo, setUserInfo] = useState(null);
  const value = { userInfo, setUserInfo };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
