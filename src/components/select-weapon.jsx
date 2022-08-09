import { observer } from "mobx-react-lite";
import React, { useState } from "react";

const SelectWeapon = ({ weapons, onSelect }) => {
  const [selected_weapon, setSelectedWeapon] = useState("");

  return (
    <select
      name="weapon-select"
      value={selected_weapon}
      onChange={(event) => {
        if (event.target.value === "") {
          return;
        }
        setSelectedWeapon(event.target.value);
        onSelect(event.target.value);
      }}
    >
      <option value="" key="0">
        --Select Weapon--
      </option>
      {weapons.map((weapon, index) => (
        <option key={index + 1} value={weapon.symbol}>
          {weapon.display_name}
        </option>
      ))}
    </select>
  );
};

export default observer(SelectWeapon);