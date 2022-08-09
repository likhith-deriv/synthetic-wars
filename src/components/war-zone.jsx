import React, { useCallback, useEffect, useRef } from "react";
import { useSocket, useStores } from "../hooks";
import { sendRequest } from "../utils/socket";
import { observer } from "mobx-react-lite";

const WarZone = () => {
  const socket = useSocket();
  const { common_store } = useStores();
  const wsRef = useRef();

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
  }, []);

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

  return <div>War Zone</div>;
};

export default observer(WarZone);

// export default WarZone;
