import { createContext, useContext } from "react";

const computer_ws = new WebSocket(
  "wss://ws.binaryws.com/websockets/v3?app_id=1089"
);
const human_ws = new WebSocket(
  "wss://ws.binaryws.com/websockets/v3?app_id=1089"
);

const SocketContext = createContext({ computer_ws: null, human_ws: null });

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={{ computer_ws, human_ws }}>
    {children}
  </SocketContext.Provider>
);

export const useSocket = () => {
  return useContext(SocketContext);
};
