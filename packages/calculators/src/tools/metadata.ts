// REVISIT: The jury is still out on whether we'll need this arbitrary metadata storage. Delete if not needed.
export type CellReference = {
  row: number;
  column: string;
};

export type SheetReference = {
  sheet: string;
  cell: CellReference;
};

export type ValueMetadata = {
  sheetRef: SheetReference;
};

export interface HasMetadata {
  metadata?: ValueMetadata;
}
