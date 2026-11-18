"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BornContent = void 0;
const Rule_1 = require("@civ-clone/core-rule/Rule");
// How many of a city's citizens are born content, before anything else makes them happier or unhappier (`lib/bornContent`
//  `bornContent`): the rest are born unhappy. A ruleset that numbers it per city (by level, by who plays the city, by the
//  size of the empire) registers it, for a player or its AI to see what one more citizen would be.
class BornContent extends Rule_1.default {
}
exports.BornContent = BornContent;
exports.default = BornContent;
//# sourceMappingURL=BornContent.js.map