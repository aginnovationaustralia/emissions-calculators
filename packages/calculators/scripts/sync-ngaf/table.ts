import {
  entriesFromObject,
  ObjectEntry,
  objectFromEntries,
} from '@/calculators/common/tools';
import { isDefined } from '@/common/filters';
import XLSX from 'xlsx-populate';
import { TableExtract, TableMapping } from './types';

export const getWorkbook = async (filePath: string) => {
  const workbook = await XLSX.fromFileAsync(filePath);
  return workbook;
};

export const getTableSheets = (workbook: XLSX.Workbook) => {
  const sheets = workbook.sheets().filter((s) => s.name() !== 'Introduction');
  const year = workbook.sheet('Introduction').cell(`A8`).value();

  return {
    year,
    sheets,
  };
};

const cellText = (cell: XLSX.Cell): string | undefined => {
  const value = cell.value();
  // xlsx-populate doesn't export the `RichText` class or include it in the return type
  // of `Cell.text`, hence the type casting.
  if (
    typeof (value as unknown as { text: () => string })?.text === 'function'
  ) {
    return (value as unknown as { text: () => string }).text();
  }
  return value?.toString();
};

const cellNumber = (cell: XLSX.Cell) => {
  const raw = cellText(cell) ?? '';

  // Some cells may have asterisks or other characters.
  const numberMatch = raw.match(/\d+(\.\d+)?/);
  if (!numberMatch) return 0;
  return Number(numberMatch[0]);
};

const firstHeaderCol = (headerCols: string) => {
  return headerCols.split(':')[0];
};

/**
 * There are usually 2 sheets ('Energy - Scope 1' and 'Energy - Scope 3') which take
 * a slightly different shape, this is a helper to try distinguish them from the other
 * sheets.
 * @param sheet
 * @returns
 */
const sheetIsInTableFormat = (sheet: XLSX.Sheet) =>
  sheet.name().slice(0, 5) === 'Table';

const getNumRowsInHeader = (sheet: XLSX.Sheet, headerCols: string) => {
  if (!sheetIsInTableFormat(sheet)) return 4;
  // Row 1 always contains the table's title, so row 2 is where the table starts
  const first = sheet.cell(`${firstHeaderCol(headerCols)}2`);
  // Sometimes the first cell is left blank.
  let offset = 1;
  while (first.relativeCell(offset, 0).value() === undefined) offset++;
  return offset;
};

const getNumColumns = (sheet: XLSX.Sheet, headerCols: string) => {
  const first = sheet.cell(`${firstHeaderCol(headerCols)}2`);
  let offset = 1;
  while (first.relativeCell(0, offset).value() !== undefined) offset++;
  return offset;
};

const getTableHeader = (
  sheet: XLSX.Sheet,
  {
    headerCols,
    startRow,
  }: Required<Pick<TableMapping<string>, 'headerCols' | 'startRow'>>,
) => {
  const isTableSheet = sheetIsInTableFormat(sheet);
  const headerRowCount = isTableSheet ? startRow - 2 : 5;
  const columnCount = getNumColumns(sheet, headerCols);
  const headerStartRow = isTableSheet ? 2 : 1;
  const start = sheet.cell(`${firstHeaderCol(headerCols)}${headerStartRow}`);

  const end = start.relativeCell(headerRowCount, columnCount - 1);
  const tableHeaderRange = start.rangeTo(end);
  const cellsInHeader = tableHeaderRange.cells();

  const header = cellsInHeader.map((row) => row.map(cellText));

  const columnKeys = tableHeaderRange
    .cells()[0]
    .map((cell) => cell.column().columnName());

  return { columnKeys, header };
};

/**
 * Iterate over one row at a time to create unique
 * names for each column.
 *
 * Returns a new record of column references to names.
 */
const applyHeaderRowToColumnMapping = (
  mapping: Record<string, string>,
  header: (string | undefined)[],
  columns: string[],
) => {
  const duplicateMappings = new Set<string>();
  const currentNames = Object.values(mapping);
  entriesFromObject(mapping).forEach(([col, name]) => {
    const duplicates = currentNames.filter((n) => n === name).length;
    if (duplicates > 1) {
      duplicateMappings.add(col);
    }
  });

  const newEntries: [string, string][] = columns.map((c) => {
    const current = mapping[c];
    const addition = header[columns.findIndex((v) => v === c)] ?? '';
    if (current === '') return [c, addition];
    else if (duplicateMappings.has(c))
      return [c, (current + ' ' + addition).trim()];
    else return [c, current];
  });
  const newMapping: Record<string, string> = objectFromEntries(newEntries);

  return newMapping;
};

/**
 * For when `TableMapping.columns` is not defined.
 * @param sheet
 * @param tableMapping
 * @returns
 */
export const getColumnMapping = <C extends string>(
  sheet: XLSX.Sheet,
  tableOrigin: Required<Pick<TableMapping<C>, 'headerCols' | 'startRow'>>,
) => {
  const { columnKeys, header } = getTableHeader(sheet, tableOrigin);

  const headerColRange = tableOrigin.headerCols.split(':');
  const numColumnsInHeader =
    headerColRange.length === 1
      ? 1
      : sheet.range(headerColRange.map((col) => `${col}1`).join(':')).cells()[0]
          .length;

  let mapping: Record<string, string> = objectFromEntries(
    columnKeys.slice(numColumnsInHeader).map((c) => [c, '']),
  );

  const columnRefs = columnKeys.slice(numColumnsInHeader);

  for (const row of header) {
    mapping = applyHeaderRowToColumnMapping(
      mapping,
      row.slice(numColumnsInHeader),
      columnRefs,
    );
  }

  // If there are any duplicates, the letter of the column (B, C, etc.) will be appended.
  return applyHeaderRowToColumnMapping(mapping, columnRefs, columnRefs);
};

const getRowName = (sheet: XLSX.Sheet, headerCols: string, row: number) => {
  const headerColRange = headerCols.split(':');
  if (headerColRange.length === 1)
    return cellText(sheet.cell(`${headerCols}${row}`))
      ?.replace(/[\u2013\u2011]/g, '-')
      ?.trim();

  const rowNameRange = headerColRange.map((col) => `${col}${row}`).join(':');
  const nameValues = sheet
    .range(rowNameRange)
    .cells()[0]
    .map(cellText)
    .filter(isDefined);
  if (nameValues.length === 0) return undefined;

  return nameValues
    .filter(isDefined)
    .join(', ')
    ?.replace(/[\u2013\u2011]/g, '-')
    .trim();
};

export const readTable = <C extends string>(
  sheet: XLSX.Sheet,
  tableMapping?: TableMapping<C>,
): { name: string; table: TableExtract<C> } => {
  const sheetName = sheet.name();
  const isTableSheet = sheetName.slice(0, 5) === 'Table';
  const tableName = !isTableSheet ? sheetName : cellText(sheet.cell(`A1`));

  const headerCols = tableMapping?.headerCols ?? 'A';
  const dataStartRow =
    tableMapping?.startRow ??
    (isTableSheet ? 2 + getNumRowsInHeader(sheet, headerCols) : 5);
  const endRow = tableMapping?.endRow;
  const combineRowsWithMergedValues =
    tableMapping?.combineRowsWithMergedValues ?? false;
  const columns =
    tableMapping?.columns ??
    getColumnMapping(sheet, { headerCols, startRow: dataStartRow });

  const table: Record<string, Record<C, number>> = {};
  let row = dataStartRow;
  while (endRow === undefined || dataStartRow <= endRow) {
    const name = getRowName(sheet, headerCols, row);
    if (name === undefined) {
      break;
    }
    const entries: [C, number][] = [];
    let mergedWithLastRow = combineRowsWithMergedValues;
    for (const col in columns) {
      if (row > 1 && combineRowsWithMergedValues) {
        const thisCellAndAbove = sheet.range(`${col}${row - 1}:${col}${row}`);
        if (!thisCellAndAbove.merged()) {
          // This might be the case for one column but not for another, in which case the
          // rows should still be treated separately
          mergedWithLastRow = false;
        }
      }

      const cell = sheet.cell(`${col}${row}`);
      const colName: C = columns[col] as C;
      const value = cellNumber(cell) || 0;
      entries.push([colName, value]);
    }

    if (mergedWithLastRow) {
      const prevName = cellText(
        sheet.cell(`${firstHeaderCol(headerCols) || 'A'}${row - 1}`),
      )?.toString();
      if (prevName !== undefined) {
        const mergedName = `${prevName} ${name}`.trim();
        table[mergedName] = objectFromEntries(entries);
        delete table[prevName];
      }
    } else {
      table[name] = objectFromEntries(entries);
    }
    row++;
  }
  return {
    name: tableName || '',
    table,
  };
};

export const generateExtract = async (
  filePath: string,
  mappings?: Record<string, TableMapping<string>>,
) => {
  const workbook = await getWorkbook(filePath);
  const { sheets, year } = getTableSheets(workbook);

  const tableEntries = sheets.map((sheet) => {
    const name = sheet.name();
    const mapping = mappings?.[name];
    const table = readTable(sheet, mapping);

    return [name, table] as ObjectEntry<Record<string, TableMapping<string>>>;
  });

  return { year, tables: objectFromEntries(tableEntries) };
};
