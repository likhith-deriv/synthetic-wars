import React, { Fragment, useCallback, useEffect, useRef } from "react";
import { useSocket, useStores } from "../hooks";
import { sendRequest } from "../utils/socket";
import { observer } from "mobx-react-lite";
import randomInteger from "random-int";
import setRandomInterval from "set-random-interval";
import { useState } from "react";

const WarZone = () => {
  const { computer_ws: socket } = useSocket();
  const { common_store } = useStores();
  const wsRef = useRef();
  const timerRef = useRef();

  const [stock, setStock] = useState(0);

  const onMessage = useCallback((msg) => {
    const data = JSON.parse(msg.data);
    if (data.msg_type === "active_symbols") {
      common_store.loadArsenal(generateWeaponData(data.active_symbols));
    }
  }, []);

  useEffect(() => {
    wsRef.current = socket;
    wsRef.current.onopen = (evt) => {
      sendRequest(wsRef.current, {
        active_symbols: "brief",
        product_type: "basic",
      });
    };

    wsRef.current.addEventListener("message", onMessage);

    return () => {
      timerRef.current?.clear();
      common_store.resetImpactRule();
    };
  }, []);

  useEffect(() => {
    setStock(common_store.arsenal.length);
  }, [common_store.arsenal]);

  useEffect(() => {
    if (stock) {
      timerRef.current = setRandomInterval(
        () => triggerMarketChange(common_store.arsenal),
        3000,
        8000
      );
    }
  }, [stock]);

  const generateWeaponData = (weaponInfo) => {
    return weaponInfo.reduce((accumulator, weapon) => {
      if (
        weapon.market === "synthetic_index" &&
        /^volatility/i.test(weapon.display_name)
      ) {
        const { display_name, symbol } = weapon;
        return [
          ...accumulator,
          {
            display_name,
            symbol,
          },
        ];
      }
      return accumulator;
    }, []);
  };

  const triggerMarketChange = () => {
    const percent = randomInteger(5, 20);
    const status = randomInteger(0, 1);

    const weapon = randomInteger(0, stock - 1);
    common_store.configureImpactRule(
      common_store.arsenal[weapon]?.display_name,
      common_store.arsenal[weapon]?.symbol,
      percent,
      status
    );
  };

  return (
    <Fragment>
      <h1>War Zone</h1>
      <div>
        <h3>Market update:</h3>
        {common_store.impact_rule.weapon && (
          <p>
            There is a{" "}
            <b>{common_store.impact_rule.status ? "BOOM" : "CRASH"}</b> of{" "}
            {common_store.impact_rule.energy}% in{" "}
            {common_store.impact_rule.display_name}
          </p>
        )}
      </div>
    </Fragment>
  );
};

export default observer(WarZone);
