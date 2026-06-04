---
name: emissions-test-xlsx
description: >-
  Read and debug local emissions-calculator test workbooks (.xlsx) with
  xlsx-populate in parallel with TypeScript module tests. Use when implementing
  or fixing sheet-driven tests, comparing spreadsheet cells to calculator
  output, dumping row inputs/outputs, or when the user mentions test xlsx,
  xlsx-populate, getSheet, or sheet-comparison.
---

# Emissions calculator test spreadsheets

Local `.xlsx` workbooks under `packages/calculators/src/modules/test/` are the source of truth for scenario inputs and expected outputs. TypeScript tests load them with **xlsx-populate** via `getSheet` from `@/test/common/sheets`.

## Where workbook and sheet are defined

Each `*.test.ts` next to its workbook calls `getSheet(workbookPath, sheetName)` inside the test. Example:

```typescript
const sheet = await getSheet(
  './src/modules/test/4.4-sheep-manure/4.4-sheep-manure.xlsx',
  '4.4.1.1',
);
```

- **workbookPath**: relative to `packages/calculators` (package root when running jest/tsx).
- **sheetName**: tab name matching the methodology subsection (e.g. `4.4.1.1`).
- **firstRow** / **rowInterval**: passed to `createSheetExtractor` (e.g. row `11`, interval `30` → scenarios at 11, 41, 71…).
- **End of scenarios**: extractor stops when `getCalculatorInput` returns `undefined` (often when the output column cell is empty).

When working on a module, **read the test file first** and treat those two strings as the parameters for any sheet inspection.

## Dump cells from a workbook (parameterised)

From `packages/calculators`:

```bash
npm run dump:sheet -- \
  --workbook ./src/modules/test/4.4-sheep-manure/4.4-sheep-manure.xlsx \
  --sheet 4.4.1.1 \
  --row 11 \
  --cells BC,BD,BE,BF,BG,BT
```

| Flag | Purpose |
|------|---------|
| `--workbook` | Path to `.xlsx` (required) |
| `--sheet` | Worksheet tab name (required) |
| `--row` | 1-based row number; repeat flag for multiple rows |
| `--cells` | Comma-separated column letters (optional) |
| `--range` | A1-style range, e.g. `A11:BT11` (optional; overrides `--cells`) |
| `--formula` | Include Excel formula text for each cell |

Examples:

```bash
# All scenario rows for one output column
npm run dump:sheet -- -w ./src/modules/test/4.4-sheep-manure/4.4-sheep-manure.xlsx -s 4.4.1.1 -r 11 -r 41 -r 71 -c BT

# Row slice with formulas (debug NRjk / intermediate columns)
npm run dump:sheet -- -w ./src/modules/test/4.4-sheep-manure/4.4-sheep-manure.xlsx -s 4.4.1.1 -r 11 --range BC11:BT11 --formula
```

Script source: [scripts/dump-test-sheet.ts](../../packages/calculators/scripts/dump-test-sheet.ts).

## Parallel development workflow

1. **Locate test** — `packages/calculators/src/modules/test/<module>/*.test.ts`.
2. **Note** `getSheet` path, sheet name, `firstRow`, `rowInterval`, output column (or custom `getExpectedOutput`).
3. **Dump spreadsheet** — use `npm run dump:sheet` with the same workbook/sheet/row; add columns from `columns.ts` or headers in the sheet.
4. **Map inputs** — extend `getCalculatorInput` to read the same cells the sheet uses; keep column letters in `columns.ts` when shared across tests.
5. **Implement calculator** — module under `src/modules/scope1/…`; align formula grouping with Excel (parentheses matter for `10^-3`, `/`, `^`).
6. **Run test** — from `packages/calculators`:
   ```bash
   npx jest path/to/your.test.ts -t "method 1"
   ```
7. **On mismatch** — `compareInputsAndOutputs` logs row number and `formatNamedValues`; set `focusOn` in `sheet-comparison.ts` to the named intermediate (e.g. `NRjk=breedingEwes,spring`). Remember: compared totals use `actual.unit.value.div(1000)` (kg → tonnes) vs raw sheet numbers in tonnes.

## Test file conventions

| Piece | Typical location |
|-------|------------------|
| Workbook | `./src/modules/test/<folder>/<name>.xlsx` |
| Column map | `./columns.ts` in same folder as tests |
| Extractor | `createSheetExtractor(getCalculatorInput, getExpectedOutput \| columnLetter, { rowInterval })` |
| Comparison | `compareInputsAndOutputs(extracted, calculateModule)` |

`getCalculatorInput(sheet, row, method)` — `method` is `'1'` or `'2'`; use for method-2-only custom columns (liveweight, DMD, etc.).

## Reading cells in code (agent)

Prefer reusing project helpers instead of ad-hoc parsing:

```typescript
import { getSheet } from '@/test/common/sheets';
import { numberInput, stringInput, isEmptyCell } from '@/test/common/sheets';

const sheet = await getSheet(workbookPath, sheetName);
const value = numberInput(sheet.cell(`BC${row}`));
```

## Formula parity checks

- Dump with `--formula` and compare grouping to TypeScript `br()` / `.multiply()` / `.divide()` trees.
- Excel: `*` and `/` are left-associative; `^` before `*`.
- A common bug: applying `10^-3` to only part of a sum — confirm parentheses in the sheet match where `.multiply(tenToPowMinus3)` sits in code.
- `formatNamedValues` display can flatten `br()`; trust numeric dumps and tests over the printed operator string.

## Adding a new sheet scenario

1. Add scenario row(s) in the workbook tab (respect existing row spacing / interval).
2. Ensure terminator column (often output column) is empty on the row after the last scenario.
3. Update `getCalculatorInput` if new inputs appear.
4. Add or extend `columns.ts` exports for new column letters.
5. Run jest; use `dump:sheet` on failing rows.

## Additional detail

See [reference.md](reference.md) for copy-paste test skeleton and livestock column patterns.
