import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSocket, useStores } from "../hooks";
import { sendRequest } from "../utils/socket";
import { observer } from "mobx-react-lite";
import randomInteger from "random-int";

const ComputerPlayer = () => {
  const [tick_id, setTickId] = useState(null);
  const [tick_value, setTickValue] = useState(0);
  const [selected_weapon, setSelectedWeapon] = useState({});
  const [weapon_list, setWeaponList] = useState([]);
  const [capture_stream, setCaptureStream] = useState(false);

  const { common_store, computer_store } = useStores();
  const wsRef = useRef();
  const socket = useSocket();

  const onMessage = useCallback((msg) => {
    if (computer_store.weapon && !capture_stream) {
      const data = JSON.parse(msg.data);
      if (data.msg_type === "tick") {
        const { quote, id } = data.tick;
        setTickValue(quote);
        setTickId(id);
        setCaptureStream(true);
      }
    }
  }, []);

  const resetTick = () => {
    if (tick_id) {
      sendRequest(wsRef.current, { forget: tick_id });
      // setCaptureStream(false);
    }
  };

  const fetchTicks = (selectedSymbol) => {
    console.log("Selected symbol: ", selectedSymbol);
    resetTick();
    sendRequest(wsRef.current, {
      ticks: selectedSymbol,
      subscribe: 1,
    });
  };

  const selectWeapon = () => {
    const weapon = weapon_list[Math.floor(Math.random() * weapon_list.length)];
    setSelectedWeapon(weapon);
  };

  const loadEnergy = () => {
    computer_store.setEnergy(tick_value);
    computer_store.discardWeapon(selected_weapon?.symbol);
    console.log("Called after loadEnergy");
    resetTick();
  };

  useEffect(() => {
    wsRef.current = socket;
    wsRef.current.addEventListener("message", onMessage);

    return () => common_store.resetCommonStore();
  }, []);

  useEffect(() => {
    if (selected_weapon?.symbol) {
      fetchTicks(selected_weapon.symbol);
      computer_store.loadWeapon(selected_weapon.symbol);
    }
  }, [selected_weapon]);

  useEffect(() => {
    if (common_store.arsenal.length) {
      setWeaponList(common_store.arsenal);
    }
  }, [common_store.arsenal]);

  useEffect(() => {
    if (selected_weapon?.symbol) {
      const remaining_arsenal = weapon_list.filter(
        (weapon) => weapon.symbol !== selected_weapon.symbol
      );
      setWeaponList(remaining_arsenal);
    }
  }, [common_store.volley_count]);

  useEffect(() => {
    selectWeapon();
  }, [weapon_list]);

  useEffect(() => {
    const timer = randomInteger(3500, 8000);
    if (capture_stream) {
      setTimeout(() => {
        loadEnergy();
      }, timer);
    }
  }, [capture_stream]);

  return (
    <section style={{ border: "1px solid red" }}>
      <h1>Computer player chooses</h1>
      <div>Selected Weapon: {selected_weapon?.display_name} </div>
      <div>Selected power:{computer_store.energy}</div>
    </section>
  );
};

export default observer(ComputerPlayer);
