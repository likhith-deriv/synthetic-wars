const computeEffectiveScore = (player, market) => {
  if (player.weapon === market.weapon) {
    const market_change = market.status ? market.energy : market.energy * -1;
    return player.energy + player.energy * (market_change / 100);
  }
  return player.energy;
};

export const tallyPower = (computer, player, market) => {
  const effective_computer_score = computeEffectiveScore(computer, market);
  const effective_player_score = computeEffectiveScore(player, market);
  return effective_computer_score < effective_player_score
    ? "COMPUTER"
    : "PLAYER";
};
