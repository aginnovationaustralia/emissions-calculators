// const columnBreed = 'B';
export const columnStateOrRegion = 'D';
export const columnCustomDurationDays = 'G';
export const columnHeadN = 'I';
export const columnProportionCowsGt2ThisSeasonInCalf = 'J';
export const columnProportionCowsGt2PreviousSeasonInCalf = 'K';
export const columnCustomLiveweightW = 'M';
export const columnCustomLiveweightGainLWG = 'O';
export const columnCustomDryMatterIntakeI = 'R';
export const columnExpectedOutput = 'V';

// const columnDmd = 'AM';
// const columnCrudeProteinContent = 'AN';

export type CellFn = (column: string, offset?: number) => string | undefined;
