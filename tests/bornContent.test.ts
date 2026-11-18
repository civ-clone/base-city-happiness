import BornContent from '../Rules/BornContent';
import City from '@civ-clone/core-city/City';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import bornContent from '../lib/bornContent';
import { expect } from 'chai';

describe('bornContent', (): void => {
  const city = {} as City,
    other = {} as City;

  it('is null when no rule answers', (): void => {
    const rules = new RuleRegistry();

    expect(bornContent(city, rules)).to.null;

    rules.register(
      new BornContent(
        new Criterion((target: City): boolean => target === other),
        new Effect((): number => 4)
      )
    );

    expect(bornContent(city, rules)).to.null;
    expect(bornContent(other, rules)).to.equal(4);
  });

  it('is the fewest any rule gives', (): void => {
    const rules = new RuleRegistry();

    rules.register(
      new BornContent(new Effect((): number => 4)),
      new BornContent(new Effect((): number => 3))
    );

    expect(bornContent(city, rules)).to.equal(3);
  });
});
