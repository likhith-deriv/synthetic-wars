import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";
import { useEffect } from "react";
import { useStores } from "../hooks";
import { tallyPower } from "../utils";

const ScoreBoard = () => {
  const { common_store, computer_store, player_store } = useStores();

  const onFireHandler = () => {
    const player_details = {
      weapon: player_store.weapon,
      energy: player_store.energy,
    };
    const computer_details = {
      weapon: computer_store.weapon,
      energy: computer_store.energy,
    };
    const result = tallyPower(
      computer_details,
      player_details,
      common_store.impact_rule
    );
    if (result === "PLAYER") {
      computer_store.modifyHealth();
    } else {
      player_store.modifyHealth();
    }
    player_store.setReadyState(false);
    computer_store.setReadyState(false);
    common_store.incrementVolley();
  };

  return (
    <Fragment>
      <button
        onClick={onFireHandler}
        disabled={!player_store.ready && !computer_store.ready}
      >
        FIRE
      </button>
      <div>
        <h2>Stats</h2>
        <table>
          <thead>
            <tr>
              <th>-</th>
              <th>Computer</th>
              <th>Player</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>Health </th>
              <td>{computer_store.health}%</td>
              <td>{player_store.health}%</td>
            </tr>
            <tr>
              <th>Previous weapon</th>
              <td>
                {common_store.volley_count - 1 >= 0 &&
                  computer_store.used_weapons[common_store.volley_count - 1]
                    ?.name}
              </td>
              <td>
                {common_store.volley_count - 1 >= 0 &&
                  player_store.used_weapons[common_store.volley_count - 1]
                    ?.name}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default observer(ScoreBoard);
