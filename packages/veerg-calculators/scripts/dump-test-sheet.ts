/**
 * Dump values (and optional formulas) from emissions-calculator test workbooks.
 *
 * Run from packages/calculators:
 *   npm run dump:sheet -- --workbook ./src/modules/test/.../file.xlsx --sheet 4.4.1.1 --row 11 --cells BC,BT
 */
import { getSheet } from '../src/test/common/sheets';
import type { Sheet } from 'xlsx-populate';

type Options = {
  workbook: string;
  sheet: string;
  rows: number[];
  cells: string[];
  range?: string;
  formula: boolean;
};

const parseArgs = (argv: string[]): Options => {
  const opts: Options = {
    workbook: '',
    sheet: '',
    rows: [],
    cells: [],
    formula: false,
  };

  const take = (i: number): string => {
    const v = argv[i + 1];
    if (v === undefined || v.startsWith('-')) {
      throw new Error(`Missing value after ${argv[i]}`);
    }
    return v;
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case '--workbook':
      case '-w':
        opts.workbook = take(i);
        i++;
        break;
      case '--sheet':
      case '-s':
        opts.sheet = take(i);
        i++;
        break;
      case '--row':
      case '-r':
        opts.rows.push(Number(take(i)));
        i++;
        break;
      case '--cells':
      case '-c':
        opts.cells = take(i)
          .split(',')
          .map((c) => c.trim().toUpperCase())
          .filter(Boolean);
        i++;
        break;
      case '--range':
        opts.range = take(i).toUpperCase();
        i++;
        break;
      case '--formula':
      case '-f':
        opts.formula = true;
        break;
      case '--help':
      case '-h':
        printHelp();
        process.exit(0);
        break;
      default:
        if (arg.startsWith('-')) {
          throw new Error(`Unknown option: ${arg}`);
        }
    }
  }

  if (!opts.workbook || !opts.sheet) {
    printHelp();
    throw new Error('--workbook and --sheet are required');
  }
  if (!opts.range && opts.rows.length === 0) {
    throw new Error('Provide at least one --row, or use --range');
  }
  if (!opts.range && opts.cells.length === 0) {
    throw new Error('Provide --cells or --range');
  }

  return opts;
};

const printHelp = (): void => {
  // eslint-disable-next-line no-console
  console.log(`Usage: npm run dump:sheet -- [options]

Required:
  -w, --workbook <path>   Path to .xlsx (relative to packages/calculators)
  -s, --sheet <name>      Worksheet tab name
  -r, --row <n>           Row number (repeatable; optional if --range is set)

One of:
  -c, --cells <cols>      Comma-separated columns, e.g. BC,BD,BT
      --range <A1:B2>     Cell range (single row or block)

Optional:
  -f, --formula           Print Excel formula when present
  -h, --help              Show this help
`);
};

const columnLettersToIndex = (letters: string): number => {
  let n = 0;
  for (const ch of letters) {
    n = n * 26 + (ch.charCodeAt(0) - 64);
  }
  return n;
};

const indexToColumnLetters = (index: number): string => {
  let n = index;
  let s = '';
  while (n > 0) {
    const rem = (n - 1) % 26;
    s = String.fromCharCode(65 + rem) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

const parseCellAddress = (
  address: string,
): { col: string; row: number } => {
  const m = /^([A-Z]+)(\d+)$/.exec(address.toUpperCase());
  if (!m) {
    throw new Error(`Invalid cell address: ${address}`);
  }
  return { col: m[1], row: Number(m[2]) };
};

const parseRange = (
  range: string,
): { colStart: number; colEnd: number; rowStart: number; rowEnd: number } => {
  const [a1, a2] = range.split(':');
  if (!a1 || !a2) {
    throw new Error(`Range must be like A11:BT11, got: ${range}`);
  }
  const start = parseCellAddress(a1);
  const end = parseCellAddress(a2);
  return {
    colStart: columnLettersToIndex(start.col),
    colEnd: columnLettersToIndex(end.col),
    rowStart: start.row,
    rowEnd: end.row,
  };
};

const formatValue = (value: unknown): string => {
  if (value === undefined || value === null) {
    return '';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? String(value) : String(value);
  }
  return String(value);
};

const dumpCell = (
  sheet: Sheet,
  address: string,
  includeFormula: boolean,
): void => {
  const cell = sheet.cell(address);
  const value = cell.value();
  const formula = includeFormula ? cell.formula() : undefined;
  const parts = [`${address}\t${formatValue(value)}`];
  if (includeFormula && formula) {
    parts.push(`\tformula=${formula}`);
  }
  // eslint-disable-next-line no-console
  console.log(parts.join(''));
};

const addressesFromOptions = (opts: Options): string[] => {
  if (opts.range) {
    const { colStart, colEnd, rowStart, rowEnd } = parseRange(opts.range);
    const out: string[] = [];
    for (let row = rowStart; row <= rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        out.push(`${indexToColumnLetters(col)}${row}`);
      }
    }
    return out;
  }

  const out: string[] = [];
  for (const row of opts.rows) {
    for (const col of opts.cells) {
      out.push(`${col}${row}`);
    }
  }
  return out;
};

const main = async (): Promise<void> => {
  const opts = parseArgs(process.argv.slice(2));
  const sheet = await getSheet(opts.workbook, opts.sheet);
  const addresses = addressesFromOptions(opts);

  // eslint-disable-next-line no-console
  console.log(`workbook: ${opts.workbook}`);
  // eslint-disable-next-line no-console
  console.log(`sheet: ${opts.sheet}`);
  // eslint-disable-next-line no-console
  console.log('address\tvalue');

  for (const address of addresses) {
    dumpCell(sheet, address, opts.formula);
  }
};

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
