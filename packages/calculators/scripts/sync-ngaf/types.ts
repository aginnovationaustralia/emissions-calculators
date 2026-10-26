export type ColumnMapping<ColumnName extends string> = Record<
  string,
  ColumnName
>;
export type TableMapping<C extends string> = Partial<{
  /**
   * `'A'` by default, can specify a range instead (e.g. `A:C`)
   */
  headerCols: string;
  /**
   * e.g. ```
   * {
   *    B: 'SCOPE2_EF',
   *    C: 'SCOPE3_EF',
   * }
   * ```
   */
  columns: ColumnMapping<C>;
  startRow: number;
  /**
   * For when the number of rows is explicitly known and would never be expected to vary.
   */
  endRow: number;
  /**
   * When all the values for 2 consecutive rows are merged (vertically), treat
   * them as one row. false by default.
   * NOTE: This ONLY works for 2 consecutive rows merged this way.
   */
  combineRowsWithMergedValues: boolean;
}>;
export type TableExtract<C extends string> = Record<string, Record<C, number>>;
