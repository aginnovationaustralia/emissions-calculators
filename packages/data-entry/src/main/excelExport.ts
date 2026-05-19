/**
 * Excel export: writes a record's expression as a formula into a sheet.
 * Row 5 (1-based) = expression as text (unmodified syntax).
 * Row 8 (1-based) = line number.
 * Row 9 (1-based) = record type (input, constant, expression, unknown).
 * Row 10 (1-based) = header row where symbol names live.
 * Row 11 (1-based) = formula row.
 */

import * as XLSX from 'xlsx';

import { extractSymbols } from '../shared/expressionParser';

/** 1-based row index for expression as text. */
const EXPRESSION_ROW = 2;
/** 1-based row index for line number. */
const LINE_ROW = 3;
/** 1-based row index for record type. */
const METHOD_1_ROW = 4;
const METHOD_2_ROW = 5;

const UNIT_ROW = 8;
const NAME_ROW = 9;
/** 1-based row index for headers (symbol names). */
const HEADER_ROW = 10;
/** 1-based row index for the formula. */
const FORMULA_ROW = 11;

export interface SymbolRecord {
  symbol: string;
  name: string;
  units: string;
  type: string;
  expression: string;
  line: string;
  method2Input?: boolean;
  notes: string;
  values?: string;
}

function findRecordBySymbol(
  records: SymbolRecord[],
  symbol: string,
): SymbolRecord | undefined {
  return records.find((r) => r.symbol === symbol);
}

/** Column index (0-based) to Excel column letter. */
function colToLetter(col: number): string {
  let s = '';
  let n = col;
  while (n >= 0) {
    s = String.fromCharCode((n % 26) + 65) + s;
    n = Math.floor(n / 26) - 1;
  }
  return s;
}

/** Column letter(s) to 0-based index (A=0, AA=26, ...). */
function letterToCol(letters: string): number {
  let col = 0;
  for (let i = 0; i < letters.length; i++) {
    col = col * 26 + (letters.charCodeAt(i) - 64);
  }
  return col - 1;
}

/** Parse cell ref "A10" to { row: 10, col: 0 } (row 1-based, col 0-based). Returns null if not a data cell. */
function parseRef(ref: string): { row: number; col: number } | null {
  const m = ref.match(/^([A-Z]+)(\d+)$/);
  if (!m) return null;
  return { row: parseInt(m[2], 10), col: letterToCol(m[1]) };
}

/** Build cell ref from 1-based row and 0-based col. */
function ref(row1Based: number, col0Based: number): string {
  return colToLetter(col0Based) + row1Based;
}

/** Build dependency order: symbols that must appear, with dependencies before dependents (topological order). */
function dependencyOrder(
  records: SymbolRecord[],
  targetSymbol: string,
  targetExpression: string,
): string[] {
  const symbolsNeeded = new Set<string>();
  function collect(sym: string) {
    if (symbolsNeeded.has(sym)) return;
    symbolsNeeded.add(sym);
    const rec = findRecordBySymbol(records, sym);
    if (rec && rec.type === 'expression' && rec.expression.trim()) {
      for (const tok of extractSymbols(rec.expression)) {
        if (findRecordBySymbol(records, tok)) collect(tok);
      }
    }
  }
  collect(targetSymbol);
  for (const tok of extractSymbols(targetExpression)) {
    if (findRecordBySymbol(records, tok)) collect(tok);
  }

  const edges = new Map<string, Set<string>>();
  for (const sym of symbolsNeeded) {
    const rec = findRecordBySymbol(records, sym);
    if (rec && rec.type === 'expression' && rec.expression.trim()) {
      for (const tok of extractSymbols(rec.expression)) {
        const dep = findRecordBySymbol(records, tok);
        if (dep && symbolsNeeded.has(dep.symbol)) {
          if (!edges.has(sym)) edges.set(sym, new Set());
          edges.get(sym)!.add(dep.symbol);
        }
      }
    }
  }

  const inDegree = new Map<string, number>();
  for (const s of symbolsNeeded) inDegree.set(s, 0);
  for (const [sym, deps] of edges) {
    inDegree.set(sym, deps.size);
  }

  const queue: string[] = [];
  for (const [s, deg] of inDegree) {
    if (deg === 0) queue.push(s);
  }
  const order: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);
    for (const [sym, deps] of edges) {
      if (deps.has(u)) {
        const newDeg = (inDegree.get(sym) ?? 0) - 1;
        inDegree.set(sym, newDeg);
        if (newDeg === 0) queue.push(sym);
      }
    }
  }
  if (order.length !== symbolsNeeded.size) {
    throw new Error('Circular dependency in expressions');
  }
  return order;
}

/** Convert expression to Excel formula by replacing symbol tokens with cell refs (whole-token only). */
function expressionToFormula(
  expression: string,
  symbolToCol: Map<string, number>,
  formulaRow: number,
): string {
  let out = expression.replace(/×/g, '*');
  const tokens = extractSymbols(expression);
  const sorted = [...tokens].sort((a, b) => b.length - a.length);
  const boundary = '[\\s()+*/\\-×^]';
  for (const token of sorted) {
    const col = symbolToCol.get(token);
    if (col === undefined) continue;
    const ref = `${colToLetter(col)}${formulaRow}`;
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(^|${boundary})(${escaped})(${boundary}|$)`, 'g');
    out = out.replace(re, `$1${ref}$3`);
  }
  return out.startsWith('=') ? out : '=' + out;
}

/** Read header row (row 10) from sheet: map header text -> column index (0-based). Preserves cell objects. */
function readHeaderRow(sheet: XLSX.WorkSheet): Map<string, number> {
  const headerToCol = new Map<string, number>();
  for (const key of Object.keys(sheet)) {
    if (key.startsWith('!')) continue;
    const parsed = parseRef(key);
    if (!parsed || parsed.row !== HEADER_ROW) continue;
    const cell = sheet[key as keyof XLSX.WorkSheet];
    if (!cell || typeof cell !== 'object') continue;
    const raw =
      (cell as { v?: unknown; w?: string }).v ??
      (cell as { v?: unknown; w?: string }).w;
    const text =
      typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();
    if (text) headerToCol.set(text, parsed.col);
  }
  return headerToCol;
}

/** Return the maximum 0-based column index used in the sheet, or -1 if none. */
function getMaxCol(sheet: XLSX.WorkSheet): number {
  let max = -1;
  const range = (sheet as { '!ref'?: string })['!ref'];
  if (range) {
    const [, br] = range.split(':');
    const brParsed = parseRef(br);
    if (brParsed) max = brParsed.col;
  }
  for (const key of Object.keys(sheet)) {
    if (key.startsWith('!')) continue;
    const parsed = parseRef(key);
    if (parsed && parsed.col > max) max = parsed.col;
  }
  return max;
}

/**
 * Merges the worksheet !ref with a rectangle so all written cells are inside the used range.
 * SheetJS/Excel ignore cells outside !ref; the old "expand right only" helper kept the bottom
 * row at e.g. row 1, which dropped rows 5–11 on typical sheets.
 */
function unionSheetRefWithRange(
  sheet: XLSX.WorkSheet,
  minRow1: number,
  maxRow1: number,
  minCol0: number,
  maxCol0: number,
): void {
  let minR = minRow1;
  let maxR = maxRow1;
  let minC = minCol0;
  let maxC = maxCol0;
  const range = (sheet as { '!ref'?: string })['!ref'];
  if (range && range.includes(':')) {
    const [tl, br] = range.split(':');
    const tlP = parseRef(tl);
    const brP = parseRef(br);
    if (tlP && brP) {
      minR = Math.min(minR, tlP.row);
      maxR = Math.max(maxR, brP.row);
      minC = Math.min(minC, tlP.col);
      maxC = Math.max(maxC, brP.col);
    }
  }
  (sheet as { '!ref': string })['!ref'] =
    `${ref(minR, minC)}:${ref(maxR, maxC)}`;
}

function minMaxCol(
  cols: Iterable<number>,
): { min: number; max: number } | null {
  let min = Infinity;
  let max = -Infinity;
  for (const c of cols) {
    if (c < min) min = c;
    if (c > max) max = c;
  }
  return max >= 0 && min !== Infinity ? { min, max } : null;
}

/** Write a single cell value (string or number) to the sheet. */
function writeCell(
  sheet: XLSX.WorkSheet,
  row1: number,
  col0: number,
  value: string | number,
): void {
  const key = ref(row1, col0);
  (sheet as Record<string, XLSX.CellObject>)[key] = {
    t: typeof value === 'number' ? 'n' : 's',
    v: value,
  };
}

/** Write a formula cell. */
function writeFormula(
  sheet: XLSX.WorkSheet,
  row1: number,
  col0: number,
  formula: string,
): void {
  const key = ref(row1, col0);
  (sheet as Record<string, XLSX.CellObject>)[key] = {
    t: 'n',
    f: formula,
  } as XLSX.CellObject;
}

export function exportRowToSheet(
  wb: XLSX.WorkBook,
  sheetName: string,
  records: SymbolRecord[],
  rowIndex: number,
): void {
  const record = records[rowIndex];
  if (!record) throw new Error('Invalid row index');
  const symbol = record.symbol.trim();
  const expression =
    record.type === 'expression' ? (record.expression || '').trim() : '';
  if (!symbol) throw new Error('Record has no symbol');
  if (!expression) throw new Error('Record has no expression to export');

  const sheet = wb.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);

  const orderedSymbols = dependencyOrder(records, symbol, expression);
  const symbolToCol = new Map<string, number>();
  let nextAppendCol = getMaxCol(sheet) + 1;
  const headerToCol = readHeaderRow(sheet);

  for (const sym of orderedSymbols) {
    const existingCol = headerToCol.get(sym);
    if (existingCol !== undefined) {
      symbolToCol.set(sym, existingCol);
      continue;
    }
    writeCell(sheet, HEADER_ROW, nextAppendCol, sym);
    symbolToCol.set(sym, nextAppendCol);
    nextAppendCol++;
  }

  const colExtent = minMaxCol(symbolToCol.values());
  if (colExtent) {
    unionSheetRefWithRange(
      sheet,
      EXPRESSION_ROW,
      FORMULA_ROW,
      colExtent.min,
      colExtent.max,
    );
  }

  for (const sym of orderedSymbols) {
    const rec = findRecordBySymbol(records, sym);
    const col = symbolToCol.get(sym);
    if (col === undefined) continue;
    const lineVal = rec?.line?.trim() ?? '';
    const typeVal = rec?.type ?? 'unknown';
    writeCell(sheet, LINE_ROW, col, lineVal);
    writeCell(sheet, METHOD_1_ROW, col, typeVal);
    writeCell(sheet, METHOD_2_ROW, col, rec?.method2Input ? 'input' : '');
    writeCell(sheet, UNIT_ROW, col, rec?.units?.trim() ?? '');
    writeCell(sheet, NAME_ROW, col, rec?.name?.trim() ?? '');
  }

  for (const sym of orderedSymbols) {
    const rec = findRecordBySymbol(records, sym);
    if (!rec || rec.type !== 'expression' || !rec.expression.trim()) continue;
    const col = symbolToCol.get(sym);
    if (col === undefined) continue;
    const exprText = rec.expression.trim();
    writeCell(sheet, EXPRESSION_ROW, col, exprText);
    const formula = expressionToFormula(exprText, symbolToCol, FORMULA_ROW);
    writeFormula(sheet, FORMULA_ROW, col, formula);
  }
}

/**
 * Appends one column per record (in JSON order) starting at the first empty column after the
 * sheet's used range. Reuses the same row layout and formula rules as {@link exportRowToSheet}.
 * Symbols that appear in the JSON take column assignments from the first matching record so
 * formulas match in-file resolution; symbols only present on the sheet keep their existing
 * header columns for references.
 */
export function exportAllRecordsToSheet(
  wb: XLSX.WorkBook,
  sheetName: string,
  records: SymbolRecord[],
): void {
  const sheet = wb.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);

  const symbolsInJson = new Set(
    records.map((r) => r.symbol.trim()).filter(Boolean),
  );
  if (symbolsInJson.size === 0) return;

  const headerToCol = readHeaderRow(sheet);
  const symbolToCol = new Map<string, number>();
  for (const [headerText, col] of headerToCol) {
    if (!symbolsInJson.has(headerText)) {
      symbolToCol.set(headerText, col);
    }
  }

  let nextCol = getMaxCol(sheet) + 1;
  const colByRecordIndex = new Map<number, number>();

  for (let i = 0; i < records.length; i++) {
    const sym = records[i].symbol.trim();
    if (!sym) continue;
    const col = nextCol++;
    colByRecordIndex.set(i, col);
    if (!symbolToCol.has(sym)) {
      symbolToCol.set(sym, col);
    }
  }

  if (colByRecordIndex.size === 0) return;

  const writtenExtent = minMaxCol(colByRecordIndex.values());
  if (writtenExtent) {
    unionSheetRefWithRange(
      sheet,
      EXPRESSION_ROW,
      FORMULA_ROW,
      writtenExtent.min,
      writtenExtent.max,
    );
  }

  for (let i = 0; i < records.length; i++) {
    const col = colByRecordIndex.get(i);
    if (col === undefined) continue;
    const rec = records[i];
    writeCell(sheet, HEADER_ROW, col, rec.symbol.trim());
    writeCell(sheet, LINE_ROW, col, rec.line?.trim() ?? '');
    writeCell(sheet, METHOD_1_ROW, col, rec.type ?? 'unknown');
    writeCell(sheet, METHOD_2_ROW, col, rec.method2Input ? 'input' : '');
    writeCell(sheet, UNIT_ROW, col, rec.units?.trim() ?? '');
    writeCell(sheet, NAME_ROW, col, rec.name?.trim() ?? '');
    if (rec.type === 'expression' && rec.expression.trim()) {
      const exprText = rec.expression.trim();
      writeCell(sheet, EXPRESSION_ROW, col, exprText);
      const formula = expressionToFormula(exprText, symbolToCol, FORMULA_ROW);
      writeFormula(sheet, FORMULA_ROW, col, formula);
    }
  }
}
