"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bornContent = void 0;
const BornContent_1 = require("../Rules/BornContent");
/**
 * How many of `city`'s citizens are born content by the ruleset's `BornContent` rules (the fewest any answer gives), or
 * `null` when none answers: no ruleset numbers it this way, so a reader takes its own.
 */
const bornContent = (city, ruleRegistry) => {
    const answers = ruleRegistry.process(BornContent_1.default, city);
    return answers.length === 0 ? null : Math.min(...answers);
};
exports.bornContent = bornContent;
exports.default = exports.bornContent;
//# sourceMappingURL=bornContent.js.map