import React, { useState, useEffect, useRef, useCallback } from "react";
import SelectWeapon from "./select-weapon";
import DisplayEnergy from "./display-energy";
import { useSocket, useStores } from "../hooks";
import { observer } from "mobx-react-lite";
import { sendRequest } from "../utils";

const OperatorConsole = () => {
  const [tick_id, setTickId] = useState(null);
  const [tick_value, setTickValue] = useState(0);
  const [selected_weapon, setSelectedWeapon] = useState({});

  const { human_ws: socket } = useSocket();
  const { common_store, player_store } = useStores();
  const wsRef = useRef();
  const capture_stream = useRef();

  const onMessage = useCallback((msg) => {
    if (player_store.weapon && capture_stream.current) {
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
    if (selected_weapon?.symbol) {
      capture_stream.current = true;
      fetchTicks(selected_weapon.symbol);
      player_store.loadWeapon(selected_weapon.symbol);
      player_store.setWeaponName(selected_weapon.display_name);
    }
  }, [selected_weapon]);

  const resetTick = () => {
    if (tick_id) {
      sendRequest(wsRef.current, { forget: tick_id });
      setTickId(null);
      setTickValue(null);
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
    player_store.discardWeapon({
      symbol: selected_weapon.symbol,
      name: selected_weapon.display_name,
    });
    player_store.setReadyState(true);
    resetTick();
    capture_stream.current = false;
    setSelectedWeapon(null);
  };

  return (
    <div>
      {Boolean(common_store.arsenal.length) && (
        <section style={{ border: "1px solid blue" }}>
          <h1>Player chooses</h1>
          <SelectWeapon
            weapons={common_store.arsenal}
            onSelect={onSelectHandler}
          />
          <DisplayEnergy energy={tick_value} />
          <button
            onClick={onLoadTurretHandler}
            disabled={tick_value === 0 || player_store.ready}
          >
            Load turret
          </button>
        </section>
      )}
    </div>
  );
};

export default observer(OperatorConsole);
