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
