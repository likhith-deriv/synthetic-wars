import { action, observable, makeObservable } from "mobx";
import Player from "./player";

export default class ComputerPlayer extends Player {
  constructor() {
    super();
    makeObservable(this);
  }
}
