import React from "react";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { Provider as PaperProvider } from 'react-native-paper';

const Root = () => {
  return (
    <AuthProvider>
      <SocketProvider>
          <PaperProvider>
            <App />
          </PaperProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default Root;
