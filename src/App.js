import logo from "./logo.svg";
import "./App.css";
import OperatorConsole from "./components/operator-console";
import WarZone from "./components/war-zone";
import ComputerPlayer from "./components/computer-player";
import { SocketProvider, StoreProvider, useStores } from "./hooks";
import Scoreboard from "./components/scoreboard";
import GameBoard from "./components/game-board";
import { observer } from "mobx-react-lite";

function App() {
  const { computer_store, common_store, player_store } = useStores();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <SocketProvider>
        <StoreProvider>
          <WarZone />
          <Scoreboard />
          <div style={{ display: "flex" }}>
            <GameBoard
              your_health={computer_store.health}
              opponent_health={player_store.health}
              volley={common_store.volley_count}
              chances={common_store.arsenal.length}
            >
              <ComputerPlayer />
            </GameBoard>
            <GameBoard
              your_health={player_store.health}
              opponent_health={computer_store.health}
              volley={common_store.volley_count}
              chances={common_store.arsenal.length}
            >
              <OperatorConsole />
            </GameBoard>
          </div>
        </StoreProvider>
      </SocketProvider>
    </div>
  );
}

export default observer(App);
