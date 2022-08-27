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
  @observable volley_count = 0;

  constructor() {
    super();
    makeObservable(this);
  }

  @action.bound
  configureImpactRule(display_name, weapon, energy, status) {
    this.impact_rule = { display_name, weapon, energy, status };
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
  resetCommonStore() {
    this.resetArsenal();
    this.resetImpactRule();
  }

  @action.bound
  incrementVolley() {
    this.volley_count += 1;
  }
}
