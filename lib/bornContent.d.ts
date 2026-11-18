import City from '@civ-clone/core-city/City';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
/**
 * How many of `city`'s citizens are born content by the ruleset's `BornContent` rules (the fewest any answer gives), or
 * `null` when none answers: no ruleset numbers it this way, so a reader takes its own.
 */
export declare const bornContent: (
  city: City,
  ruleRegistry: RuleRegistry
) => number | null;
export default bornContent;
