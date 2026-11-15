"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStagedCitizenState = void 0;
const calculateCitizenState_1 = require("./calculateCitizenState");
const applyStep = (counts, step) => {
    var _a, _b, _c;
    const changed = {
        ...counts,
        happy: counts.happy + ((_a = step.happy) !== null && _a !== void 0 ? _a : 0),
        unhappy: counts.unhappy + ((_b = step.unhappy) !== null && _b !== void 0 ? _b : 0) - ((_c = step.content) !== null && _c !== void 0 ? _c : 0),
    };
    const applied = step.apply ? step.apply({ ...changed }) : changed;
    // An `apply` can't make citizens less than not angry.
    return applied.angry < 0 ? { ...applied, angry: 0 } : applied;
};
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
/**
 * Keeps the counts to what the city has, after a stage: no more happy or unhappy citizens than its size, and no more of
 * both together than its working citizens, taking away angry citizens, or failing those happy ones, as unhappy ones go.
 * Angry citizens come back as plain unhappy ones before anything else changes: whenever the unhappy count falls below
 * the angry count, and while there is room among the working citizens. So a content effect turns an angry citizen
 * unhappy before it makes a plain unhappy one content, and an angry citizen takes two to become content.
 */
const clampStage = ({ happy, unhappy, angry }, size, specialists) => {
    happy = clamp(happy, 0, size);
    while (angry > 0 && unhappy < angry) {
        angry--;
        unhappy++;
    }
    unhappy = clamp(unhappy, 0, size);
    const working = clamp(size - specialists, 0, 99);
    while (unhappy + happy > working) {
        if (angry <= 0) {
            happy = clamp(happy - 1, 0, size);
        }
        else {
            angry--;
        }
        unhappy = clamp(unhappy - 1, 0, size);
    }
    while (angry > 0 && unhappy + happy < size - specialists) {
        angry--;
        unhappy++;
    }
    return { happy, unhappy, angry };
};
/**
 * The happy, unhappy and angry citizens of a city whose happiness comes in stages, each clamped before the next (a
 * ruleset's base unhappiness, then luxuries, buildings, units, wonders, say). Unlike `calculateCitizenState`, which
 * sees only the city's net `Happiness` and `Unhappiness`, this keeps what each stage leaves for the next, and has angry
 * citizens: those unhappy beyond the city's size at the start. Angry citizens are counted among the unhappy ones, so a
 * ruleset's disorder test (fewer happy citizens than unhappy ones, say) needs nothing new.
 *
 * Only the base can make citizens angry: unhappiness a later stage adds beyond the city's size is lost in the clamp.
 * After each stage the counts are clamped (`clampStage`), and recorded in `stages`. The angry count can exceed the
 * unhappy one only when the base has more than twice the city's size unhappy; `states` never shows more angry citizens
 * than unhappy ones.
 */
const calculateStagedCitizenState = ({ size, specialists = 0, unhappy, stages = [], }) => {
    let counts = {
        happy: 0,
        unhappy: Math.min(unhappy, size),
        angry: unhappy > size ? unhappy - size : 0,
    };
    const byStage = [], record = (name) => {
        counts = clampStage(counts, size, specialists);
        byStage.push({ name, ...counts });
    };
    record('base');
    stages.forEach((stage) => {
        var _a;
        counts = [stage, ...((_a = stage.steps) !== null && _a !== void 0 ? _a : [])].reduce(applyStep, counts);
        record(stage.name);
    });
    const working = clamp(size - specialists, 0, 99), angry = Math.min(counts.angry, counts.unhappy), content = Math.max(working - counts.happy - counts.unhappy, 0);
    return {
        ...counts,
        content,
        states: [
            ...new Array(counts.happy).fill(calculateCitizenState_1.CitizenState.Happy),
            ...new Array(content).fill(calculateCitizenState_1.CitizenState.Content),
            ...new Array(counts.unhappy - angry).fill(calculateCitizenState_1.CitizenState.Unhappy),
            ...new Array(angry).fill(calculateCitizenState_1.CitizenState.Angry),
        ],
        stages: byStage,
    };
};
exports.calculateStagedCitizenState = calculateStagedCitizenState;
exports.default = exports.calculateStagedCitizenState;
//# sourceMappingURL=calculateStagedCitizenState.js.map