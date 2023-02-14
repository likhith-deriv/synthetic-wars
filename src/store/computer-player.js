import { makeObservable } from "mobx";
import Player from "./player";

export default class ComputerPlayer extends Player {
  constructor(root_store) {
    super(root_store);
    makeObservable(this);
  }
}
