import { CitizenState } from './calculateCitizenState';
/**
 * A city's happy and unhappy citizens part way through `calculateStagedCitizenState`. `unhappy` counts the angry
 * citizens too: `angry` says how many of them are angry.
 */
export interface IStagedCounts {
  happy: number;
  unhappy: number;
  angry: number;
}
/**
 * One change to the counts: `unhappy` more unhappy citizens, `content` fewer (each content effect), `happy` more happy
 * ones, then `apply`, for a change other than adding or taking away (a government with no unhappy citizens, or units
 * that each quiet one unhappy citizen but no more than there are), in that order.
 */
export interface IHappinessStep {
  happy?: number;
  content?: number;
  unhappy?: number;
  apply?: (counts: IStagedCounts) => IStagedCounts;
}
/**
 * One stage of a ruleset's happiness: its own change (`happy`, `content`, `unhappy`, then `apply`), then each of its
 * `steps` in order, for a stage whose effects must follow one another. The counts are clamped after the whole stage,
 * not between its steps. In Civ2's wonders stage, Shakespeare's Theatre sets the unhappy to none before J.S. Bach's
 * takes 2 away: `steps: [{ apply: (counts) => ({ ...counts, unhappy: 0 }) }, { content: 2 }]`. Given as
 * `{ content: 2, apply: … }` instead, Bach's would come first and be lost to the reset.
 */
export interface IHappinessStage extends IHappinessStep {
  /** What the stage is, for a report of the stages: 'luxuries', 'buildings', or whatever the ruleset likes. */
  name: string;
  steps?: IHappinessStep[];
}
/** The counts after one stage, as a city screen shows them stage by stage. */
export interface IStagedCountsByStage extends IStagedCounts {
  name: string;
}
export interface IStagedCitizenState extends IStagedCounts {
  /** Working citizens neither happy nor unhappy. */
  content: number;
  /**
   * The mood of each working citizen: the happy ones, then the content ones, the unhappy ones and the angry ones last.
   *  Specialists aren't in it.
   */
  states: CitizenState[];
  /** The counts after each stage, the base first (named 'base'). */
  stages: IStagedCountsByStage[];
}
export interface IStagedCitizenStateOptions {
  /** The city's size. */
  size: number;
  /** How many of its citizens are specialists, and so neither happy nor unhappy. */
  specialists?: number;
  /** How many citizens are unhappy to begin with: any beyond the city's size are angry. */
  unhappy: number;
  /** The ruleset's stages, in order. */
  stages?: IHappinessStage[];
}
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
export declare const calculateStagedCitizenState: ({
  size,
  specialists,
  unhappy,
  stages,
}: IStagedCitizenStateOptions) => IStagedCitizenState;
export default calculateStagedCitizenState;
