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
import { sendRequest } from "../utils/socket";

const OperatorConsole = () => {
  const [tick_id, setTickId] = useState(null);
  const [tick_value, setTickValue] = useState(0);
  const [selected_weapon, setSelectedWeapon] = useState("");

  const socket = useSocket();
  const { common_store, player_store } = useStores();
  const wsRef = useRef();

  const onMessage = useCallback((msg) => {
    if (player_store.weapon) {
      const data = JSON.parse(msg.data);
      if (data.msg_type === "tick") {
        const { quote, id } = data.tick;
        setTickValue(quote);
        setTickId(id);
      }
    }
  }, []);

  useEffect(() => {
    wsRef.current = socket;
    wsRef.current.addEventListener("message", onMessage);

    return () => common_store.resetCommonStore();
  }, []);

  useEffect(() => {
    if (selected_weapon) {
      fetchTicks(selected_weapon);
      player_store.loadWeapon(selected_weapon);
    }
  }, [selected_weapon]);

  const resetTick = () => {
    if (tick_id) {
      sendRequest(wsRef.current, { forget: tick_id });
    }
  };

  const fetchTicks = (selectedSymbol) => {
    resetTick();
    sendRequest(wsRef.current, {
      ticks: selectedSymbol,
      subscribe: 1,
    });
  };

  const onSelectHandler = (weapon) => setSelectedWeapon(weapon);

  const onLoadTurretHandler = () => {
    player_store.setEnergy(tick_value);
    player_store.discardWeapon(selected_weapon);
    resetTick();
  };

  return (
    <Fragment>
      {Boolean(common_store.arsenal.length) && (
        <section style={{ border: "1px solid blue" }}>
          <SelectWeapon
            weapons={common_store.arsenal}
            onSelect={onSelectHandler}
          />
          <DisplayEnergy energy={tick_value} />
          <button onClick={onLoadTurretHandler} disabled={tick_value === 0}>
            Load turret
          </button>
        </section>
      )}
      <div>Selected {player_store.used_weapons}</div>
    </Fragment>
  );
};

export default observer(OperatorConsole);
