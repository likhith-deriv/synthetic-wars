import { action, observable, makeObservable } from "mobx";
import Base from "./base";
export default class Player extends Base {
  @observable weapon;
  @observable energy;
  @observable used_weapons = [];
  @observable health = 100;

  constructor() {
    super();
    makeObservable(this);
  }

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

  @action.bound
  discardWeapon(weapon) {
    this.used_weapons = [...this.used_weapons, weapon];
  }
}
