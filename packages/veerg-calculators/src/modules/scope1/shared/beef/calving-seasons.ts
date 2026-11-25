import { getPreviousMonth, Month, Months } from '@/constants/enums';

/**
 * Fixed calving seasons for monthly (Method 2 herd flow) beef herds.
 *
 * Methodological Guidance Chapter 3 v1.1, 3.2.2.1 (LCjk=4,5):
 *
 * > the calving season should be considered 3 months from the calving month and the
 * > season after calving the 3 months after this period if Method 2 herd flow data is
 * > used (see Chapter 1 Section 1.9) and that for all other time periods Ljk=4,5 = 0.
 *
 * So a calving season is a fixed block of 3 months starting at a calving (start) month,
 * and the season after calving is the next fixed block of 3 months. GEETA implements the
 * same rule (`InputFunctions_PastureBeef.CalculateProportionCowsCalvingForSeason`,
 * and the "Calving season" / "Season after calving" columns of the Method 2 calving
 * tables): every month of a calving season gets that season's total calving, every month
 * of the season after gets the same total as its previous-season share, and all other
 * months get 0.
 *
 * The year is treated as circular (a season starting in November covers November,
 * December and January), as GEETA's offsets wrap within the 12 reporting months.
 */

export const CALVING_SEASON_LENGTH_MONTHS = 3;

/** The month `count` months after `month`, wrapping around the year. */
export const getMonthAfter = (month: Month, count: number): Month =>
  Months[(Months.indexOf(month) + (count % 12) + 12) % 12];

/**
 * The start month of the calving season that `month` falls in, or `undefined` when it is
 * in no calving season. When seasons overlap (start months less than 3 months apart) the
 * nearest start wins: the month itself, then 1 month before, then 2 months before, the
 * order GEETA's `CalculateProportionCowsCalvingForSeason` checks them in.
 */
export const getCalvingSeasonStart = (
  month: Month,
  startMonths: readonly Month[],
): Month | undefined => {
  for (let back = 0; back < CALVING_SEASON_LENGTH_MONTHS; back += 1) {
    const candidate = getPreviousMonth(month, back);
    if (startMonths.includes(candidate)) {
      return candidate;
    }
  }
  return undefined;
};

/** The 3 months of the calving season that starts in `start`. */
export const getCalvingSeasonMonths = (start: Month): Month[] =>
  Array.from({ length: CALVING_SEASON_LENGTH_MONTHS }, (_, k) =>
    getMonthAfter(start, k),
  );

/**
 * The months whose calving is summed for the *season of calving* share in `month`
 * (LCjk=4,5 calv). Empty when `month` is in no calving season.
 */
export const getMonthsForSeasonOfCalving = (
  month: Month,
  startMonths: readonly Month[],
): Month[] => {
  const start = getCalvingSeasonStart(month, startMonths);
  return start === undefined ? [] : getCalvingSeasonMonths(start);
};

/**
 * The months whose calving is summed for the *season after calving* share in `month`
 * (LCjk=4,5 prev). A month is in the season after calving when the month 3 months
 * earlier is in a calving season, and the share is that season's total. Empty when
 * `month` is in no season after calving.
 */
export const getMonthsForSeasonAfterCalving = (
  month: Month,
  startMonths: readonly Month[],
): Month[] =>
  getMonthsForSeasonOfCalving(
    getPreviousMonth(month, CALVING_SEASON_LENGTH_MONTHS),
    startMonths,
  );
