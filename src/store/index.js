import Common from "./common";
import ComputerPlayer from "./computer-player";
import Player from "./player";

export class RootStore {
  constructor() {
    this.common_store = new Common(this);
    this.player_store = new Player(this);
    this.computer_store = new ComputerPlayer(this);
  }
}
