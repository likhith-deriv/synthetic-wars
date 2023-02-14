import { action, observable, makeObservable } from "mobx";
import Base from "./base";
export default class Player extends Base {
  @observable display_name;
  @observable weapon;
  @observable energy;
  @observable used_weapons = [];
  @observable health = 100;
  @observable ready = false;

  constructor(root_store) {
    super(root_store);

    console.log(root_store);
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
    const weapons = this.root_store.common_store.arsenal.length;
    this.health -= Math.ceil(100 / (weapons - this.used_weapons.length + 1));
    console.log("fix_percent: ", this.health);
  }

  @action.bound
  setReadyState(status) {
    this.ready = status;
  }
}
