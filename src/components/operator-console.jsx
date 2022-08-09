import React, {
  useState,
  useEffect,
  Fragment,
  useRef,
  useCallback,
} from "react";
import SelectWeapon from "./select-weapon";
import DisplayEnergy from "./display-energy";
import { useSocket, useStores } from "../hooks";
import { observer } from "mobx-react-lite";

const OperatorConsole = () => {
  const [tick_id, setTickId] = useState(null);
  const [tick_value, setTickValue] = useState(0);
  const [selected_weapon, setSelectedWeapon] = useState("");

  const socket = useSocket();
  const { common_store } = useStores();
  const wsRef = useRef();

  console.log("common_store: ", common_store.arsenal);

  const onMessage = useCallback((msg) => {
    const data = JSON.parse(msg.data);
    if (data.msg_type === "tick") {
      const { quote, id } = data.tick;
      setTickValue(quote);
      setTickId(id);
    }
  }, []);

  useEffect(() => {
    wsRef.current = socket;
    wsRef.current.addEventListener("message", onMessage);
  }, []);

  const sendRequest = (payload) => {
    if (socket.readyState === 1) {
      socket.send(JSON.stringify(payload));
    }
  };

  const resetTick = () => {
    if (tick_id) {
      sendRequest({ forget: tick_id });
    }
  };

  const fetchTicks = (selectedSymbol) => {
    resetTick();
    sendRequest(wsRef.current, {
      ticks: selectedSymbol,
      subscribe: 1,
    });
  };

  const onSelectHandler = (weapon) => {
    console.log("Weapon: ", weapon);
    setSelectedWeapon(weapon);
    fetchTicks(weapon);
  };

  return (
    <Fragment>
      {Boolean(common_store.arsenal.length) && (
        <div>
          <SelectWeapon
            weapons={common_store.arsenal}
            onSelect={onSelectHandler}
          />
          <DisplayEnergy energy={tick_value} />
        </div>
      )}
    </Fragment>
  );
};

export default observer(OperatorConsole);
