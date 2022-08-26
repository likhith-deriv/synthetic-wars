import { action, observable, makeObservable } from "mobx";
import Base from "./base";

export default class Common extends Base {
  @observable impact_rule = {
    weapon: "",
    energy: 0,
    status: 0,
    display_name: "",
  };
  @observable arsenal = [];
  @observable is_player_ready = false;
  @observable is_computer_ready = false;
  @observable player_health = 100;
  @observable computer_health = 100;
  @observable volley_count = 0;

  constructor() {
    super();
    makeObservable(this);
  }

  @action.bound
  configureImpactRule(display_name, weapon, energy, status) {
    this.impact_rule = { display_name, weapon, energy, status };
    console.log("Impact: ", { ...this.impact_rule });
  }

  @action.bound
  resetImpactRule() {
    this.impact_rule = {};
  }

  @action.bound
  loadArsenal(arsenal_list) {
    this.arsenal = [...arsenal_list];
  }

  @action.bound
  resetArsenal() {
    this.arsenal = [];
  }

  @action.bound
  setPlayerReady(status) {
    this.is_player_ready = status;
  }

  @action.bound
  setComputerReady(status) {
    this.is_computer_ready = status;
  }

  @action.bound
  resetCommonStore() {
    this.resetArsenal();
    this.resetImpactRule();
  }

  @action.bound
  modifyPlayerHealth() {
    this.player_health -= 10;
  }

  @action.bound
  modifySystemHealth() {
    this.computer_health -= 10;
  }

  @action.bound
  incrementVolley() {
    this.volley_count += 1;
  }
}
