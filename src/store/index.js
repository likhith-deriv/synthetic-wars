import Common from "./common";
import Player from "./player";

export class RootStore {
  constructor() {
    this.common_store = new Common(this);
    this.player_store = new Player(this);
  }
}
