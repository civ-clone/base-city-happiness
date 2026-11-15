import { SpecialistRegistry } from '@civ-clone/core-city/SpecialistRegistry';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';
import Yield from '@civ-clone/core-yield/Yield';
/**
 * A citizen's mood. `Angry` is an unhappy citizen beyond what the city's size allows for, which a ruleset that has them
 *  counts among its unhappy citizens (see `lib/calculateStagedCitizenState`). `calculateCitizenState` never gives it.
 *  Last, so the other three keep their values.
 */
export declare enum CitizenState {
  Unhappy = 0,
  Content = 1,
  Happy = 2,
  Angry = 3,
}
/**
 * The mood of each of a city's working citizens. Specialists are neither happy nor unhappy, and are taken out before
 * any `Happiness` is applied: from the content citizens first, then from the unhappy ones. So the list is shorter than
 * the city's size by one per specialist.
 *
 * Each point of `Unhappiness` makes a citizen unhappy, from the end of the list. Each point of `Happiness` then makes a
 * content citizen happy or, when none is left, an unhappy one content, from the start of the list.
 */
export declare const calculateCitizenState: (
  cityGrowth: CityGrowth,
  yields?: Yield[],
  specialistRegistry?: SpecialistRegistry
) => CitizenState[];
export type CitizenMood = 'unhappy' | 'content' | 'happy' | 'angry';
/** The name a renderer is sent for a `CitizenState`. */
export declare const citizenMood: (citizenState: CitizenState) => CitizenMood;
/** How many citizens are `[unhappy, content, happy]`. An angry citizen is unhappy too: `angryCount` says how many are. */
export declare const citizenSummary: (
  state: CitizenState[]
) => [number, number, number];
/** How many of the citizens are angry. */
export declare const angryCount: (state: CitizenState[]) => number;
export default calculateCitizenState;
