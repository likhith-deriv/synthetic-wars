import React from "react";

const GameBoard = ({
  children,
  your_health,
  opponent_health,
  volley,
  chances,
}) => {
  if (volley === chances && your_health < opponent_health) {
    return <h1>You have been defeated!</h1>;
  } else if (volley === chances && opponent_health < your_health) {
    return <h1>You have won!</h1>;
  }

  return children;
};

export default GameBoard;
