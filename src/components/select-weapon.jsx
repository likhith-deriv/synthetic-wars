import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { useStores } from "../hooks";

const SelectWeapon = ({ weapons, onSelect }) => {
  const [selected_weapon, setSelectedWeapon] = useState("");
  const { player_store } = useStores();

  return (
    <select
      name="weapon-select"
      value={selected_weapon}
      onChange={(event) => {
        if (event.target.value === "") {
          return;
        }
        setSelectedWeapon(event.target.value);
        const chosen_weapon = weapons.find(
          (weapon) => weapon.symbol === event.target.value
        );
        onSelect(chosen_weapon);
      }}
    >
      <option value="" key="0">
        --Select Weapon--
      </option>
      {weapons.map((weapon, index) => (
        <option
          key={index + 1}
          value={weapon.symbol}
          disabled={player_store.used_weapons.includes(weapon.symbol)}
        >
          {weapon.display_name}
        </option>
      ))}
    </select>
  );
};

export default observer(SelectWeapon);
