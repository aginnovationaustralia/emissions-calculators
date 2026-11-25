# Beef calving seasons for monthly (Method 2) herds

This note explains a change to how the pasture beef calculations (3.2 enteric methane, 4.2 manure management) handle
calving in monthly herds. It comes from comparing the 1.1.0-beta.3 package to the pre-release version of the GEETA tool.

## Summary

- A monthly herd can now give its calving the way the guidance and GEETA describe it: the months in which calving
  seasons start, and the share of each class calving in each month. The calculator works out LC<sub>jk=4,5</sub> (and
  the calves' shares) from fixed 3-month calving seasons.
- The existing per-month inputs (`fractionCowsThisSeasonInCalf` and the rest) still work, unchanged, when the start
  months are not given. Their descriptions no longer describe rolling windows.
- No equation changed. Only how the per-month shares are found changed, and only when the new input is used.

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

3.2.2.3 (FA<sub>ijkl=4,5</sub>) repeats that "the calving season should be considered 3 months from the calving month if
Method 2 herd flow data is used". The same shares feed 4.2.1.3 (5) milk production (MP<sub>jk=4,5</sub>) and the calves'
milk intake MC<sub>jk=1,3,6</sub> in 4.2.1.3 (3).

So under Method 2 a calving season is a fixed block of 3 months that starts at a calving month, and the season after
calving is the next block of 3 months. Every other month has LC = 0.

## What aia did before

aia's monthly cow and calf periods took the two shares for each month as inputs, and described them as rolling
windows: "this season" was the month and the 2 months before it, and "previous season" the 3 months before those. The
caller worked them out. The geeta-comparison adapter did this from GEETA's monthly proportions and did not use the
start months.

The two readings give the same annual totals but spread them differently across the months. With the example in the
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

Each month's intake (and so CH<sub>4</sub> and N excretion) is weighted by these shares, so the results differ by a
fraction of a per cent. The March calving is outside both declared seasons: the fixed reading doesn't count it, as the
guidance says ("for all other time periods L<sub>jk=4,5</sub> = 0") and as GEETA does.

## The change

### Inputs

`BeefClassesMonthlyInput` (the `classes` of a monthly beef herd) has a new optional field:

- `calvingSeasonStartMonths`: a list of months (`'january'` … `'december'`). Give `[]` for a herd that does not calve.

When it is given, each month of the cow classes (cows 1-2, 2-3 and > 3 years) gives `fractionCowsCalvingThisMonth`, and
each month of the calf classes (bulls, cows and steers < 1 year) gives `fractionCalvesBornThisMonth`.

When it is not given, each month gives the shares directly, as before: `fractionCowsThisSeasonInCalf` and
`fractionCowsPreviousSeasonInCalf`, or `fractionCalvesBornThisSeason` and `fractionCalvesBornPreviousSeason`. These
four are now optional in the schema, because the other form doesn't use them; the herd-level check requires them in
this form.

Seasonal (Method 1) herds are unchanged.

### How the shares are worked out

`src/modules/scope1/shared/beef/calving-seasons.ts` holds the month rules, with no calculator dependencies:

- A month's calving season is the one whose start month is the month itself, the month before, or the month 2 before,
  checked in that order. So when seasons overlap (start months less than 3 months apart), the nearest start wins. This
  is GEETA's rule; the guidance doesn't cover overlapping seasons.
- LC for the season of calving is the sum of `fractionCowsCalvingThisMonth` over that season's 3 months.
- LC for the season after calving is the same sum for the month 3 months earlier.
- Months outside every season get 0. Calving recorded in such a month is not counted.
- The year wraps: a season starting in November covers November, December and January.

`src/modules/scope1/shared/beef/calving.ts` applies them during the calculation. `getCowCalvingShares` and
`getCalfBirthShares` return the two shares for a class in a period, from either input form. The derived shares appear in
the calculation tree as `LCjk=5b (season of calving, j=september)`, `LCjk=5b (season after calving, j=september)` (and
`CRjk=1 (…)` for calves), as sums of the monthly inputs. They are used in:

- 3.2.1.1 (4) MA<sub>jk=4,5</sub>, `calculateAdditionalIntakeForMilkProduction` (`shared/beef/calculate.ts`)
- 4.2.1.3 (5) MP<sub>jk=4,5</sub>, `calculateMilkProduction` (`4.2-beef-pasture-manure-n2o.ts`)
- 4.2.1.3 (3) MC<sub>jk=1,3,6</sub>, `calculateMilkIntake` (`4.2-beef-pasture-manure-n2o.ts`)

### Validation

`BeefClassesMonthlyInputSchema` checks the whole herd:

- With start months: every month of every cow and calf class gives its per-month value, and none gives the season
  shares. No start month is listed twice. For every month, the season-of-calving share and the season-after-calving
  share add up to no more than 1.
- Without start months: every month gives both season shares, and none gives a per-month value.

The herd's `classes` field is a union (empty, seasonal or monthly), so a herd that fails these checks is reported as
"Invalid input" at the herd level. That is existing behaviour, shared by the seasonal checks.

## Tests

- `src/modules/scope1/shared/beef/calving-seasons.test.ts`: the month rules, with the expected months listed for every
  month: one season, two back-to-back seasons, a season that wraps into the new year, overlapping seasons, no seasons.
- `src/modules/scope1/shared/beef/calving.test.ts`: a herd written out month by month (cows > 3 years and bull calves),
  with:
  - LC for both seasons, and MA, for each of the 12 months, worked out by hand (for example September:
    0.4 × 1.3 + 0.2 × 1.1 + 0.4 = 1.14);
  - the calves' shares for each month;
  - the same herd written with the season shares worked out by hand gives the same enteric CH<sub>4</sub>, manure
    CH<sub>4</sub> and direct N<sub>2</sub>O;
  - an empty list of start months gives 0 everywhere;
  - each validation rule above.


## Open points

- **The comparison adapter's provider decision.** `geeta-comparison/calculators/aia/mapping.json`
  assumptions["cow calving proportions"] and ["calf calving rates"] are provider decisions that accept the rolling
  windows. With this change the adapter gives aia GEETA's start months instead, so those decisions need updating for
  Method 2.
- **Calves' calving rate units.** GEETA's calf table is labelled in head, and its milk intake divides the season's rate
  by the month's head (`VEERG_4_2_1_3__3a_MilkConsumption`: CR<sub>calv</sub>/N<sub>jkl</sub>). The neutral export
  labels it "calving rate (per cent)", and the adapter divides by 100. The two agree only when a calf class has 100 head.
  This change keeps aia's input as a proportion and doesn't settle which GEETA means.
- **Sheep.** Lambing (findings sections 18 and 24) has the same rolling against fixed season difference. The same
  pattern (start months plus monthly rates) would fit the sheep monthly inputs.
- **Calving outside the declared seasons** is silently not counted, as in GEETA. A warning could help users who forget
  a start month.
