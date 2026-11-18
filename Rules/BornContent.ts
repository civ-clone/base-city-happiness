import City from '@civ-clone/core-city/City';
import Rule from '@civ-clone/core-rule/Rule';

// How many of a city's citizens are born content, before anything else makes them happier or unhappier (`lib/bornContent`
//  `bornContent`): the rest are born unhappy. A ruleset that numbers it per city (by level, by who plays the city, by the
//  size of the empire) registers it, for a player or its AI to see what one more citizen would be.
export class BornContent extends Rule<[City], number> {}

export default BornContent;
