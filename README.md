# base-city-happiness

Works out the mood of each of a city's working citizens, for a ruleset's civil disorder, celebration and city screen:

- `lib/calculateCitizenState`: `calculateCitizenState(cityGrowth, yields?, specialistRegistry?)` returns a
  `CitizenState` (`Unhappy`, `Content` or `Happy`) per working citizen. Each point of `Unhappiness` makes a citizen
  unhappy, from the end of the list; specialists are then taken out, from the content citizens first and then the
  unhappy ones; each point of `Happiness` then makes a content citizen happy or, when none is left, an unhappy one
  content, from the start of the list. `citizenSummary(state)` counts them as `[unhappy, content, happy]`, and
  `citizenMood(state)` names one for a renderer.
  `CitizenState.Angry` is an unhappy citizen beyond what the city's size allows for. This calculator never gives it;
  `citizenSummary` counts it as unhappy, `angryCount(state)` says how many there are, and `citizenMood` names it
  `'angry'`.
- `lib/calculateStagedCitizenState`: `calculateStagedCitizenState({ size, specialists?, unhappy, stages? })`, for a
  ruleset whose happiness comes in stages (base, luxuries, buildings, units, wonders), each clamped before the next, as
  Civilization II has it. Unhappy citizens beyond the size at the start are angry, and counted among the unhappy. After
  each stage an angry citizen becomes a plain unhappy one before any content effect reaches a plain unhappy citizen, so
  an angry citizen takes two to become content. Each stage gives `happy`, `content` and `unhappy` changes, applied in
  that order, then `apply` for anything else (martial law that quiets no more than there are unhappy, a government with
  no unhappy citizens), then its `steps`, each the same kind of change, in order. The clamp runs after the whole stage.
  When effects within a stage must follow one another, use `steps`: in Civ2's wonders stage Shakespeare's Theatre sets
  the unhappy to none before J.S. Bach's takes 2 away, so
  `steps: [{ apply: (counts) => ({ ...counts, unhappy: 0 }) }, { content: 2 }]`. Written as
  `{ content: 2, apply: … }`, Bach's would come first and be lost to the reset.
  It returns the counts, a `CitizenState` per working citizen, and the counts after each stage, for a city screen.
  `calculateCitizenState` is unchanged: a ruleset chooses the one it uses.
- `lib/civilDisorder`: `inCivilDisorder(city, yields, ruleRegistry?)`, whether any of the ruleset's `CivilDisorder`
  rules says the city is in disorder, for the rules that stop what a city produces while it is.

A library: it registers no rules. See `civ1-city-happiness` for Civilization's rules that use it.
