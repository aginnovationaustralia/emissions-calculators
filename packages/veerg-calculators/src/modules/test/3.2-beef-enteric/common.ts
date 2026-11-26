// const columnBreed = 'B';
export const columnStateOrRegion = 'D';
export const columnCustomDurationDays = 'G';
export const columnHeadN = 'I';
// Calving input. The next two columns (LC for the season of calving and the season after
// it) are the sheet's own calculation from it and the herd's calving table.
export const columnProportionCowsCalving = 'J';
export const columnCustomLiveweightW = 'N';
export const columnCustomLiveweightGainLWG = 'P';
export const columnCustomDryMatterIntakeI = 'S';
export const columnExpectedOutput = 'W';

// The herd's calving table: "Calving season?" (seasonal) or "Calving start month?" (monthly),
// Yes/No for each season or month, from 2 rows below the scenario's first row
export const columnCalvingPeriod = 'D';
export const calvingTableFirstRowOffset = 2;

// const columnDmd = 'AM';
// const columnCrudeProteinContent = 'AN';

export type CellFn = (column: string, offset?: number) => string | undefined;

/** The seasons marked "Yes" in the herd's "Calving season?" table */
export const readCalvingSeasons = (cell: CellFn) =>
  (['spring', 'summer', 'autumn', 'winter'] as const).filter(
    (_, index) =>
      cell(columnCalvingPeriod, calvingTableFirstRowOffset + index) === 'Yes',
  );

/** The months marked "Yes" in the herd's "Calving start month?" table */
export const readCalvingSeasonStartMonths = (cell: CellFn) =>
  (
    [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december',
    ] as const
  ).filter(
    (_, index) =>
      cell(columnCalvingPeriod, calvingTableFirstRowOffset + index) === 'Yes',
  );
