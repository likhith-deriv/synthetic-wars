import { createContext, useContext } from "react";

const ws = new WebSocket("wss://ws.binaryws.com/websockets/v3?app_id=1089");

const SocketContext = createContext(ws);

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={ws}>{children}</SocketContext.Provider>
);

export const useSocket = () => {
  return useContext(SocketContext);
};
