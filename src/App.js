import logo from "./logo.svg";
import "./App.css";
import OperatorConsole from "./components/operator-console";
import WarZone from "./components/war-zone";
import { SocketProvider, StoreProvider } from "./hooks";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <SocketProvider>
        <StoreProvider>
          <WarZone />
          <OperatorConsole />
        </StoreProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
