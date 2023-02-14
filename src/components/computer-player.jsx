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

  const { common_store, computer_store } = useStores();
  const wsRef = useRef();
  const { computer_ws: socket } = useSocket();
  const capture_stream = useRef();

  const onMessage = useCallback((msg) => {
    if (computer_store.weapon && capture_stream.current) {
      const data = JSON.parse(msg.data);
      if (data.msg_type === "tick") {
        const { quote, id } = data.tick;
        setTickValue(quote);
        setTickId(id);
      }
    }
  }, []);

  const resetTick = () => {
    if (tick_id) {
      setTickId(null);
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

  const selectWeapon = () => {
    const weapon = weapon_list[Math.floor(Math.random() * weapon_list.length)];
    setSelectedWeapon(weapon);
  };

  const loadEnergy = () => {
    computer_store.setEnergy(tick_value);
    computer_store.discardWeapon({
      symbol: selected_weapon.symbol,
      name: selected_weapon.display_name,
    });
    resetTick();
    capture_stream.current = false;
    setSelectedWeapon(null);
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
      computer_store.setWeaponName(selected_weapon.display_name);
    }
  }, [selected_weapon]);

  useEffect(() => {
    if (common_store.arsenal.length) {
      setWeaponList(common_store.arsenal);
    }
  }, [common_store.arsenal]);

  useEffect(() => {
    if (weapon_list.length) {
      const remaining_arsenal = weapon_list.filter(
        (weapon) => weapon.symbol !== computer_store.weapon
      );
      setWeaponList(remaining_arsenal);
    }
    console.log("Computer: setting true");
    capture_stream.current = true;
  }, [common_store.volley_count]);

  useEffect(() => {
    selectWeapon();
  }, [weapon_list]);

  useEffect(() => {
    const timer = randomInteger(3500, 8000);
    if (tick_id) {
      setTimeout(() => {
        loadEnergy();
      }, timer);
    }
  }, [tick_id]);

  return (
    <section style={{ border: "1px solid red" }}>
      <h1>Computer chooses</h1>
      <div>Selected Weapon: {computer_store.display_name} </div>
      <div>Selected power:{computer_store.energy}</div>
    </section>
  );
};

export default observer(ComputerPlayer);
