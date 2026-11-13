import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import Yield from '@civ-clone/core-yield/Yield';
/**
 * Whether `city` is in civil disorder now, with `yields` as its yields: any of the ruleset's `CivilDisorder` rules
 * says so. For rules that stop the city's production, research or the like while it lasts.
 */
export declare const inCivilDisorder: (
  city: City,
  yields: Yield[],
  ruleRegistry?: RuleRegistry
) => boolean;
export default inCivilDisorder;
