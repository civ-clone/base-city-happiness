"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inCivilDisorder = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const CivilDisorder_1 = require("@civ-clone/core-city-happiness/Rules/CivilDisorder");
/**
 * Whether `city` is in civil disorder now, with `yields` as its yields: any of the ruleset's `CivilDisorder` rules
 * says so. For rules that stop the city's production, research or the like while it lasts.
 */
const inCivilDisorder = (city, yields, ruleRegistry = RuleRegistry_1.instance) => ruleRegistry
    .process(CivilDisorder_1.default, city, yields)
    .some((result) => result);
exports.inCivilDisorder = inCivilDisorder;
exports.default = exports.inCivilDisorder;
//# sourceMappingURL=civilDisorder.js.map