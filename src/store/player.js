import { action, observable } from "mobx";
import Base from "./base";

export default class Player extends Base {
  @observable name;
  @observable weapon;
  @observable energy;

  @action.bound
  loadWeapon(weapon) {
    this.weapon = weapon;
  }

  @action.bound
  setEnergy(energy) {
    this.energy = energy;
  }

  @action.bound
  setName(name) {
    this.name = name;
  }
}
