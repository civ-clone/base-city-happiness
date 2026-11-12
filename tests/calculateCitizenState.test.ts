import {
  CitizenState,
  calculateCitizenState,
  citizenMood,
  citizenSummary,
} from '../lib/calculateCitizenState';
import CityGrowth from '@civ-clone/core-city-growth/CityGrowth';
import Happiness from '@civ-clone/base-city-yield-happiness/Happiness';
import SpecialistRegistry from '@civ-clone/core-city/SpecialistRegistry';
import Unhappiness from '@civ-clone/base-city-yield-unhappiness/Unhappiness';
import Yield from '@civ-clone/core-yield/Yield';
import { expect } from 'chai';

// A stand-in city of `size` with `specialists` specialists: the calculator only asks for the size and the number of
//  specialists.
const summarise = (
  yields: Yield[],
  specialists: number,
  size: number = 6
): [number, number, number] => {
  const city = {},
    cityGrowth = {
      city: () => city,
      size: () => size,
    } as unknown as CityGrowth,
    specialistRegistry = {
      getByCity: (cityToFind: unknown) =>
        cityToFind === city ? new Array(specialists).fill(null) : [],
    } as unknown as SpecialistRegistry;

  return citizenSummary(
    calculateCitizenState(cityGrowth, yields, specialistRegistry)
  );
};

describe('calculateCitizenState', (): void => {
  it('makes every citizen content with no Happiness or Unhappiness', (): void => {
    expect(summarise([], 0)).eql([0, 6, 0]);
  });

  it('counts every citizen when there are no specialists', (): void => {
    expect(summarise([new Unhappiness(2), new Happiness(2)], 0)).eql([2, 2, 2]);
  });

  it('draws specialists from the content citizens first', (): void => {
    expect(summarise([new Unhappiness(2), new Happiness(2)], 1)).eql([2, 1, 2]);
  });

  it('then from the unhappy citizens, before any are made happy', (): void => {
    expect(summarise([new Unhappiness(2), new Happiness(2)], 3)).eql([1, 1, 1]);
  });

  it('from the unhappy citizens when there are no content ones', (): void => {
    expect(summarise([new Unhappiness(6)], 2)).eql([4, 0, 0]);
  });

  it('spends each point of Happiness once', (): void => {
    expect(summarise([new Unhappiness(3), new Happiness(4)], 0)).eql([2, 1, 3]);
  });

  it('never makes more citizens unhappy than the city has', (): void => {
    expect(summarise([new Unhappiness(9)], 0, 4)).eql([4, 0, 0]);
  });

  it('puts the happy citizens first and the unhappy ones last', (): void => {
    const city = {},
      state = calculateCitizenState(
        { city: () => city, size: () => 3 } as unknown as CityGrowth,
        [new Unhappiness(1), new Happiness(1)],
        { getByCity: () => [] } as unknown as SpecialistRegistry
      );

    expect(state).eql([
      CitizenState.Happy,
      CitizenState.Content,
      CitizenState.Unhappy,
    ]);
    expect(state.map(citizenMood)).eql(['happy', 'content', 'unhappy']);
  });
});
