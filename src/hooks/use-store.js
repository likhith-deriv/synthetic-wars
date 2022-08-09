import { createContext, useContext } from "react";
import { RootStore } from "../store";

const root_store = new RootStore();
const stores = {
  common_store: root_store.common_store,
  player_store: root_store.player_store,
};
const StoresContext = createContext(stores);

export const useStores = () => {
  return useContext(StoresContext);
};

export const StoreProvider = ({ children }) => (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
);
