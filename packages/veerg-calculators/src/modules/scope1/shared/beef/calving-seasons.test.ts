import {
  getMonthsForSeasonAfterCalving,
  getMonthsForSeasonOfCalving,
  getSeasonsForSeasonAfterCalving,
  getSeasonsForSeasonOfCalving,
} from './calving-seasons';

/**
 * The fixed calving seasons of Chapter 3, 3.2.2.1 (LCjk=4,5): a calving season is the 3
 * months from a calving season start month, and the season after calving is the 3 months
 * after that. Each test lists the expected months for every month of the year.
 */
describe('Beef calving seasons (Method 2, monthly)', () => {
  describe('one calving season starting in September', () => {
    const startMonths = ['september'] as const;

    test.each([
      // month, months summed for the season of calving, months summed for the season after calving
      ['january', [], ['september', 'october', 'november']],
      ['february', [], ['september', 'october', 'november']],
      ['march', [], []],
      ['april', [], []],
      ['may', [], []],
      ['june', [], []],
      ['july', [], []],
      ['august', [], []],
      ['september', ['september', 'october', 'november'], []],
      ['october', ['september', 'october', 'november'], []],
      ['november', ['september', 'october', 'november'], []],
      ['december', [], ['september', 'october', 'november']],
    ] as const)('%s', (month, seasonOfCalving, seasonAfterCalving) => {
      expect(getMonthsForSeasonOfCalving(month, startMonths)).toEqual(
        seasonOfCalving,
      );
      expect(getMonthsForSeasonAfterCalving(month, startMonths)).toEqual(
        seasonAfterCalving,
      );
    });
  });

  describe('two calving seasons starting in June and September (back to back)', () => {
    const startMonths = ['june', 'september'] as const;

    test.each([
      // month, season of calving, season after calving
      ['january', [], ['september', 'october', 'november']],
      ['february', [], ['september', 'october', 'november']],
      ['march', [], []],
      ['april', [], []],
      ['may', [], []],
      ['june', ['june', 'july', 'august'], []],
      ['july', ['june', 'july', 'august'], []],
      ['august', ['june', 'july', 'august'], []],
      [
        'september',
        ['september', 'october', 'november'],
        ['june', 'july', 'august'],
      ],
      [
        'october',
        ['september', 'october', 'november'],
        ['june', 'july', 'august'],
      ],
      [
        'november',
        ['september', 'october', 'november'],
        ['june', 'july', 'august'],
      ],
      ['december', [], ['september', 'october', 'november']],
    ] as const)('%s', (month, seasonOfCalving, seasonAfterCalving) => {
      expect(getMonthsForSeasonOfCalving(month, startMonths)).toEqual(
        seasonOfCalving,
      );
      expect(getMonthsForSeasonAfterCalving(month, startMonths)).toEqual(
        seasonAfterCalving,
      );
    });
  });

  describe('a season starting in November wraps into the new year', () => {
    const startMonths = ['november'] as const;

    test.each([
      ['october', [], []],
      ['november', ['november', 'december', 'january'], []],
      ['december', ['november', 'december', 'january'], []],
      ['january', ['november', 'december', 'january'], []],
      ['february', [], ['november', 'december', 'january']],
      ['march', [], ['november', 'december', 'january']],
      ['april', [], ['november', 'december', 'january']],
      ['may', [], []],
    ] as const)('%s', (month, seasonOfCalving, seasonAfterCalving) => {
      expect(getMonthsForSeasonOfCalving(month, startMonths)).toEqual(
        seasonOfCalving,
      );
      expect(getMonthsForSeasonAfterCalving(month, startMonths)).toEqual(
        seasonAfterCalving,
      );
    });
  });

  test('no start months: no month is in a calving season or a season after calving', () => {
    expect(getMonthsForSeasonOfCalving('june', [])).toEqual([]);
    expect(getMonthsForSeasonAfterCalving('september', [])).toEqual([]);
  });

  describe('seasonal herd calving in winter and spring', () => {
    const calvingSeasons = ['winter', 'spring'] as const;

    test.each([
      // season, seasons summed for the season of calving, for the season after calving
      ['spring', ['spring'], ['winter']],
      ['summer', [], ['spring']],
      ['autumn', [], []],
      ['winter', ['winter'], []],
    ] as const)('%s', (season, seasonOfCalving, seasonAfterCalving) => {
      expect(getSeasonsForSeasonOfCalving(season, calvingSeasons)).toEqual(
        seasonOfCalving,
      );
      expect(getSeasonsForSeasonAfterCalving(season, calvingSeasons)).toEqual(
        seasonAfterCalving,
      );
    });
  });

  test('seasonal herd with no calving seasons: no season has calving shares', () => {
    expect(getSeasonsForSeasonOfCalving('spring', [])).toEqual([]);
    expect(getSeasonsForSeasonAfterCalving('summer', [])).toEqual([]);
  });
});
