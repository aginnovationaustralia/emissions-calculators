# Beef calving seasons

This note explains how the pasture beef calculations (3.2 enteric methane, 4.2 manure management) take a herd's
calving, and why. It comes from comparing the 1.1.0-beta.3 package with the pre-release GEETA tool

## Summary

- A beef herd gives its calving one way only, the way the guidance and GEETA describe it:
  - **when** the herd calves: `calvingSeasons` (seasonal herds) or `calvingSeasonStartMonths` (monthly herds), on the
    herd's `classes`
  - **how much** it calves in each period: `fractionCowsCalving` for each period of the cow classes, and
    `calvesBorn` (head) for each period of the calf classes
- The calculator works out LC<sub>jk=4,5</sub> for the season of calving and the season after calving, and the calves'
  shares, from these. No equation changed.

## What the guidance says

Methodological Guidance Chapter 3 v1.1.

3.2.1.1 (4), additional intake for milk production:

> MA<sub>jk=4,5</sub> = (LC<sub>jk=4,5</sub> × FA<sub>jk=4,5</sub>) + (1 − LC<sub>jk=4,5</sub>)
>
> LC<sub>jk=4,5</sub> = proportion of cows > 1 years (k=4,5) in calf in the season of calving. Applied to calving
> season and the season immediately after calving expressed as a fraction noting that for all other seasons
> LC<sub>jk=4,5</sub> = 0

3.2.2.1, LC<sub>jk=4,5</sub> data source:

> Noting that the calving season should be considered 3 months from the calving month and the season after calving the
> 3 months after this period if Method 2 herd flow data is used (see Chapter 1 Section 1.9) and that for all other time
> periods L<sub>jk=4,5</sub> = 0.

The same shares feed 4.2.1.3 (5) milk production (MP<sub>jk=4,5</sub>), and the calves' milk intake
MC<sub>jk=1,3,6</sub> in 4.2.1.3 (3) follows the same seasons.

So a calving season is a fixed period: a season (seasonal herds), or 3 months from a calving month (monthly herds). The
season after calving is the next season, or the next 3 months. Every other period has LC = 0.


## What aia did before

aia's periods took the two shares for each period as inputs, worked out by the caller. For monthly herds the
descriptions defined them as rolling windows: "this season" was the month and the 2 months before it, and "previous
season" the 3 months before those. The calves' shares were proportions of the class, not head counts.

The rolling reading gives the same annual total but spreads it differently across the months. With the example in the
unit tests (calving seasons starting in June and September; cows calving March 0.05, June 0.10, July 0.05, August 0.05,
September 0.30, October 0.10):

| Month | Rolling: this season | Rolling: previous season | Fixed: season of calving | Fixed: season after calving |
|---|---:|---:|---:|---:|
| January | 0 | 0.45 | 0 | 0.40 |
| February | 0 | 0.40 | 0 | 0.40 |
| March | 0.05 | 0.10 | 0 | 0 |
| April | 0.05 | 0 | 0 | 0 |
| May | 0.05 | 0 | 0 | 0 |
| June | 0.10 | 0.05 | 0.20 | 0 |
| July | 0.15 | 0.05 | 0.20 | 0 |
| August | 0.20 | 0.05 | 0.20 | 0 |
| September | 0.40 | 0.10 | 0.40 | 0.20 |
| October | 0.45 | 0.15 | 0.40 | 0.20 |
| November | 0.40 | 0.20 | 0.40 | 0.20 |
| December | 0.10 | 0.40 | 0 | 0.40 |

The March calving is outside both calving seasons. The fixed reading has no place for it: GEETA leaves it out, and aia
now rejects it (see Validation).

## The inputs

On the herd's `classes`:

- seasonal herds: `calvingSeasons`, a list of seasons (`'spring'` … `'winter'`)
- monthly herds: `calvingSeasonStartMonths`, a list of months (`'january'` … `'december'`)

Both are required. Give `[]` for a herd that doesn't calve.

On each period (season or month) of a class:

- cow classes (cows 1-2, 2-3 and > 3 years): `fractionCowsCalving`, the proportion of the class calving in the period
- calf classes (bulls, cows and steers < 1 year): `calvesBorn`, the number of calves of the class born in the period
  (head)

## How the shares are worked out

`src/modules/scope1/shared/beef/calving-seasons.ts` holds the rules, with no calculator dependencies:

- Seasonal herds: a season's share for the season of calving is its own calving when it is a calving season, otherwise
  0. Its share for the season after calving is the previous season's calving when that one is a calving season,
  otherwise 0.
- Monthly herds: a month belongs to the calving season whose start month is the month itself, the month before, or the
  month 2 before. Start months are at least 3 months apart (see Validation), so seasons don't overlap and a month
  belongs to at most one. Its share for the season of calving is the calving summed over that season's 3 months. Its
  share for the season after calving is the same sum for the month 3 months earlier. The year wraps: a season starting
  in November covers November, December and January.
- Calving recorded in a period outside every calving season would not be counted, so the input check rejects it.

`src/modules/scope1/shared/beef/calving.ts` applies them:

- `getCowCalvingShares`: LC<sub>jk=4,5</sub> for the season of calving and the season after calving, the class's
  `fractionCowsCalving` summed over the periods of that calving season. Used in 3.2.1.1 (4) MA<sub>jk=4,5</sub>
  (`calculateAdditionalIntakeForMilkProduction`, `shared/beef/calculate.ts`) and 4.2.1.3 (5) MP<sub>jk=4,5</sub>
  (`calculateMilkProduction`, `4.2-beef-pasture-manure-n2o.ts`).
- `getCalfBirthShares`: the class's `calvesBorn` summed over the periods of the calving season (CR<sub>calv</sub>) and
  of the season before (CR<sub>prev</sub>), each divided by the class's head in the current period (N<sub>jkl</sub>), as
  GEETA does; 0 when the class has no animals in the period. Used in 4.2.1.3 (3) MC<sub>jk=1,3,6</sub>
  (`calculateMilkIntake`).

The shares appear in the calculation tree as `LCjk=5b (season of calving, j=september)`,
`LCjk=5b (season after calving, j=september)` and `CRjk=1 / Njk (season of calving, j=september)`, with the sums of
the period inputs below them.

## Validation

`BeefClassesSeasonalInputSchema` and `BeefClassesMonthlyInputSchema` check the whole herd
(`calculators/Beef/types/beef-calving-validation.ts`):

- no calving season or start month is listed twice, and start months are at least 3 months apart, so calving seasons
  don't overlap ("the calving season should be considered 3 months from the calving month", 3.2.2.1). Overlapping
  seasons would count the calving of the shared months in both
- for every period of every cow class, the share for the season of calving and the share for the season after calving
  add up to no more than 1
- no cow class calves (`fractionCowsCalving` > 0), and no calf class has calves born (`calvesBorn` > 0), in a period that
  is in no calving season. The message names the class and period and says how to fix it: add the season to
  `calvingSeasons`, or a start month covering the month to `calvingSeasonStartMonths` (the month or one of the 2 before
  it), or set the value to 0
- for every period in which a calf class has animals, the calves born in its season of calving and in the season before
  are no more than the class's head in the period, as the calves' milk intake takes them as shares of the class. A
  period with no animals has no milk intake, so it isn't checked (its shares are 0)

Rejecting calving outside the calving seasons follows the guidance. Its calving seasons come from when the herd calves:
LC<sub>jk=4,5</sub> is the proportion in calf "in the season of calving" (3.2.1.1 (4)), and under Method 2 "the calving
season should be considered 3 months from the calving month" (3.2.2.1). A period in which cows calve is a season of
calving, so calving in a period the herd doesn't list as one contradicts the herd's calving seasons. "LC = 0 for all
other seasons" covers periods without calving. The check changes no result for consistent input. GEETA is more lenient:
it leaves such calving out. Its NIRAlignment_09 scenario ("no calving") keeps calf calving rates with no calving season,
which aia rejects (the geeta-comparison adapter leaves them out, as GEETA does).

The calves' limit means the calves' shares add up to no more than 1. Under Method 2 it is strict early in a season: the
first month of a season counts the whole season's births against that month's head, so a herd whose calves are mostly
born later in the season needs that month's head to include them. Without the limit the milk intake would be
overstated (a share of 3 counts each calf's milk 3 times).

Each issue has the path of the input it is about (for example `cowsGt3Years.march.fractionCowsCalving`), below the herd's
`classes`. The `classes` field is a union (empty, seasonal or monthly), so the herd-level error is "Invalid input", with
these issues inside it.

## Tests

- `src/modules/scope1/shared/beef/calving-seasons.test.ts`: the rules, with the expected periods for every month or
  season: one monthly season, two back-to-back seasons, a season that wraps into the new year, seasonal herds, no
  seasons.
- `src/modules/scope1/shared/beef/calving.test.ts`: a monthly herd and a seasonal herd written out period by period,
  with LC, MA and the calves' shares for every period worked out by hand (for example September:
  0.4 × 1.3 + 0.2 × 1.1 + 0.4 = 1.14; December calves: 30 born in the September season / 50 head = 0.6), a herd with
  no calving seasons, a calf class with no animals, and each validation rule, including calving and calves born outside
  the calving seasons.
- The spreadsheet tests (`src/modules/test/3.2-beef-enteric/3.2-beef-enteric.xlsx`,
  `src/modules/test/4.2-beef-pasture/4.2-beef.xlsx`) take the same inputs:
  - each scenario has a calving table in columns C:D below its first row: "Calving season?" Yes/No per season, or
    "Calving start month?" Yes/No per month
  - "Cows calving" (3.2: column J; 4.2: column S) is the proportion of each cow class calving in the period, and
    "CR<sub>jk</sub> (calves born)" (4.2: column V) the calves born, head (taken from the old sheet's `=<born>/<head>`
    formulas; some of those divided by the row above's head)
  - the LC columns (3.2: K, L; 4.2: T, U) and the calves' share columns (4.2: W, X) are formulas implementing the
    rules above, so the sheet works out the shares independently of the code
  - the old per-period shares were converted: a period is a calving season when any class calved in it; each class's
    calving is its old "this season" share; calves born are the old "this season" share × head. The monthly scenarios
    start their calving seasons in September and December; calving in other months (0.05 of cows > 3 years in August)
    was set to 0, and their calves born were chosen by hand, as their rolling shares don't convert to births.

## Open points

- **Sheep.** Lambing (findings sections 18 and 24) has the same rolling against fixed season pattern. The same inputs
  (when the flock lambs, plus lambs born per period) would fit the sheep inputs.
