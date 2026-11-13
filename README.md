# base-city-happiness

Works out the mood of each of a city's working citizens, for a ruleset's civil disorder, celebration and city screen:

- `lib/calculateCitizenState`: `calculateCitizenState(cityGrowth, yields?, specialistRegistry?)` returns a
  `CitizenState` (`Unhappy`, `Content` or `Happy`) per working citizen. Each point of `Unhappiness` makes a citizen
  unhappy, from the end of the list; specialists are then taken out, from the content citizens first and then the
  unhappy ones; each point of `Happiness` then makes a content citizen happy or, when none is left, an unhappy one
  content, from the start of the list. `citizenSummary(state)` counts them as `[unhappy, content, happy]`, and
  `citizenMood(state)` names one for a renderer.
- `lib/civilDisorder`: `inCivilDisorder(city, yields, ruleRegistry?)`, whether any of the ruleset's `CivilDisorder`
  rules says the city is in disorder, for the rules that stop what a city produces while it is.

A library: it registers no rules. See `civ1-city-happiness` for Civilization's rules that use it.
