import { action, observable, makeObservable } from "mobx";
import Base from "./base";
export default class Player extends Base {
  @observable display_name;
  @observable weapon;
  @observable energy;
  @observable used_weapons = [];
  @observable health = 100;
  @observable ready = false;

  constructor() {
    super();
    makeObservable(this);
  }

  @action.bound
  loadWeapon(weapon) {
    this.weapon = weapon;
  }

  @action.bound
  setWeaponName(name) {
    this.display_name = name;
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

  @action.bound
  modifyHealth() {
    this.health -= 10;
  }

  @action.bound
  setReadyState(status) {
    this.ready = status;
  }
}
