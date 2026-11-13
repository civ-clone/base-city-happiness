import City from '@civ-clone/core-city/City';
import CivilDisorder from '@civ-clone/core-city-happiness/Rules/CivilDisorder';
import Effect from '@civ-clone/core-rule/Effect';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import { expect } from 'chai';
import inCivilDisorder from '../lib/civilDisorder';

describe('inCivilDisorder', (): void => {
  const city = {} as City;

  it('is true when any CivilDisorder rule says so', (): void => {
    const ruleRegistry = new RuleRegistry();

    ruleRegistry.register(
      new CivilDisorder(new Effect((): boolean => false)),
      new CivilDisorder(new Effect((): boolean => true))
    );

    expect(inCivilDisorder(city, [], ruleRegistry)).true;
  });

  it('is false when every rule says no, or there are none', (): void => {
    const ruleRegistry = new RuleRegistry();

    expect(inCivilDisorder(city, [], ruleRegistry)).false;

    ruleRegistry.register(new CivilDisorder(new Effect((): boolean => false)));

    expect(inCivilDisorder(city, [], ruleRegistry)).false;
  });

  it('asks the rules about the city and the yields it is given', (): void => {
    const ruleRegistry = new RuleRegistry(),
      yields = [new Yield(3)],
      asked: [City, Yield[] | undefined][] = [];

    ruleRegistry.register(
      new CivilDisorder(
        new Effect((askedCity: City, askedYields?: Yield[]): boolean => {
          asked.push([askedCity, askedYields]);

          return false;
        })
      )
    );

    inCivilDisorder(city, yields, ruleRegistry);

    expect(asked).to.have.length(1);
    expect(asked[0][0]).to.equal(city);
    expect(asked[0][1]).to.equal(yields);
  });
});
