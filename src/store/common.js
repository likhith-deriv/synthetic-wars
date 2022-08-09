import { action, observable } from "mobx";
import Base from "./base";

export default class Common extends Base {
  @observable impact_rule = { weapon: "", energy: 0 };
  @observable arsenal = [];

  @action.bound
  configureImpactRule(weapon, energy) {
    this.impact_rule = { weapon, energy };
  }

  @action.bound
  loadArsenal(arsenal_list) {
    this.arsenal = arsenal_list;
    console.log("List: ", this.arsenal);
  }
}
