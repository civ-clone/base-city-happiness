import {
  CitizenState,
  angryCount,
  citizenMood,
  citizenSummary,
} from '../lib/calculateCitizenState';
import {
  IStagedCounts,
  calculateStagedCitizenState,
} from '../lib/calculateStagedCitizenState';
import { expect } from 'chai';

const { Angry, Content, Happy, Unhappy } = CitizenState,
  // The counts after each stage, as [name, happy, unhappy, angry].
  byStage = (stages: { name: string } & IStagedCounts[]) =>
    stages.map(({ name, happy, unhappy, angry }) => [
      name,
      happy,
      unhappy,
      angry,
    ]),
  // Martial law as Civ2 has it: each unit quiets one unhappy citizen, but no more than there are.
  martialLaw =
    (units: number) =>
    (counts: IStagedCounts): IStagedCounts => ({
      ...counts,
      unhappy: counts.unhappy - Math.min(Math.max(units, 0), counts.unhappy),
    });

// Every expected count below was worked by hand from Civ2's stage clamp (OpenCiv2 `city_happy_clamp_stage`, city.cpp
//  ~3460), not from this implementation.
describe('calculateStagedCitizenState', (): void => {
  it('keeps the existing states where they were, and adds Angry after them', (): void => {
    expect([Unhappy, Content, Happy, Angry]).eql([0, 1, 2, 3]);
    expect([Unhappy, Content, Happy, Angry].map(citizenMood)).eql([
      'unhappy',
      'content',
      'happy',
      'angry',
    ]);
  });

  it('counts angry citizens among the unhappy ones', (): void => {
    const state = [Happy, Content, Unhappy, Angry, Angry];

    expect(citizenSummary(state)).eql([3, 1, 1]);
    expect(angryCount(state)).equal(2);
  });

  it('makes citizens unhappy beyond the size angry, and needs no stages', (): void => {
    const result = calculateStagedCitizenState({ size: 12, unhappy: 15 });

    expect([result.happy, result.content, result.unhappy, result.angry]).eql([
      0, 0, 12, 3,
    ]);
    expect(result.states).eql([
      ...new Array(9).fill(Unhappy),
      Angry,
      Angry,
      Angry,
    ]);
    expect(byStage(result.stages as any)).eql([['base', 0, 12, 3]]);
  });

  // Size 12 under Despotism, 15 unhappy to begin with: luxuries for one happy citizen, a Temple (2 content), 3 units
  //  of martial law, no wonders.
  it('works a size-12 Despotism city with luxuries, a Temple and martial law', (): void => {
    const result = calculateStagedCitizenState({
      size: 12,
      unhappy: 15,
      stages: [
        { name: 'luxuries', happy: 1 },
        { name: 'buildings', content: 2 },
        { name: 'units', apply: martialLaw(3) },
        { name: 'wonders' },
      ],
    });

    expect(byStage(result.stages as any)).eql([
      ['base', 0, 12, 3],
      // The happy citizen takes an angry one's place.
      ['luxuries', 1, 11, 2],
      // The Temple's two content effects turn the two angry citizens unhappy.
      ['buildings', 1, 11, 0],
      ['units', 1, 8, 0],
      ['wonders', 1, 8, 0],
    ]);
    expect([result.happy, result.content, result.unhappy, result.angry]).eql([
      1, 3, 8, 0,
    ]);
    expect(citizenSummary(result.states)).eql([8, 3, 1]);
  });

  it('turns angry citizens unhappy before any content effect reaches a plain unhappy one', (): void => {
    // Size 6 with 1 specialist, 9 unhappy to begin with.
    const result = calculateStagedCitizenState({
      size: 6,
      specialists: 1,
      unhappy: 9,
      stages: [
        { name: 'luxuries' },
        { name: 'buildings', content: 1 },
        { name: 'units', content: 2 },
        { name: 'wonders', happy: 1 },
      ],
    });

    expect(byStage(result.stages as any)).eql([
      // Only 5 work: one angry citizen goes with the specialist.
      ['base', 0, 5, 2],
      ['luxuries', 0, 5, 2],
      // One effect: one angry citizen is now plainly unhappy.
      ['buildings', 0, 5, 1],
      // Two: the last angry one, then one plain unhappy one made content.
      ['units', 0, 4, 0],
      ['wonders', 1, 4, 0],
    ]);
    expect(result.states).eql([Happy, Unhappy, Unhappy, Unhappy, Unhappy]);
  });

  it('lets martial law quiet no more than there are unhappy, unlike content effects', (): void => {
    const withMartialLaw = calculateStagedCitizenState({
        size: 6,
        unhappy: 8,
        stages: [{ name: 'units', apply: martialLaw(8) }],
      }),
      withContent = calculateStagedCitizenState({
        size: 6,
        unhappy: 8,
        stages: [{ name: 'units', content: 8 }],
      });

    expect(byStage(withMartialLaw.stages as any)).eql([
      ['base', 0, 6, 2],
      ['units', 0, 2, 0],
    ]);
    expect(byStage(withContent.stages as any)).eql([
      ['base', 0, 6, 2],
      ['units', 0, 0, 0],
    ]);
  });

  it('brings angry citizens back when a stage sets the unhappy to none', (): void => {
    // As Shakespeare's Theatre does in Civ2: unhappy set to 0, angry left as it was.
    const result = calculateStagedCitizenState({
      size: 8,
      unhappy: 10,
      stages: [
        {
          name: 'wonders',
          apply: (counts: IStagedCounts): IStagedCounts => ({
            ...counts,
            unhappy: 0,
          }),
        },
      ],
    });

    expect(byStage(result.stages as any)).eql([
      ['base', 0, 8, 2],
      ['wonders', 0, 2, 0],
    ]);
  });

  it('leaves none unhappy or angry for a stage that clears both', (): void => {
    // As Fundamentalism does in Civ2.
    const result = calculateStagedCitizenState({
      size: 8,
      unhappy: 10,
      stages: [
        {
          name: 'units',
          apply: (counts: IStagedCounts): IStagedCounts => ({
            ...counts,
            unhappy: 0,
            angry: 0,
          }),
        },
      ],
    });

    expect([result.happy, result.content, result.unhappy, result.angry]).eql([
      0, 8, 0, 0,
    ]);
  });

  it('makes no one angry for unhappiness a later stage adds, and takes happy citizens away first', (): void => {
    const result = calculateStagedCitizenState({
      size: 4,
      unhappy: 3,
      stages: [
        { name: 'luxuries', happy: 2 },
        { name: 'units', unhappy: 5 },
      ],
    });

    expect(byStage(result.stages as any)).eql([
      ['base', 0, 3, 0],
      // 2 happy and 3 unhappy is one too many for 4: a happy one goes, with an unhappy one.
      ['luxuries', 1, 2, 0],
      // 1 happy and 7 unhappy: the unhappy are clamped to 4, then each happy citizen goes with an unhappy one.
      ['units', 0, 3, 0],
    ]);
  });
});
