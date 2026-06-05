# Test xlsx reference

## Minimal seasonal test skeleton

```typescript
import { getSheet } from '@/test/common/sheets';
import { compareInputsAndOutputs, createSheetExtractor } from '../sheet-comparison';
import * as col from './columns';

const WORKBOOK = './src/modules/test/<folder>/<workbook>.xlsx';
const SHEET = '4.x.x.x';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): MyInput | undefined => {
  if (sheet.cell(`${col.columnOutput}${row}`).value() === undefined) {
    return undefined;
  }
  // ... read inputs via sheet.cell(`${col.columnHead}${row}`)
};

const extract = createSheetExtractor(
  getCalculatorInput,
  col.columnOutput, // or custom getExpectedOutput
  { rowInterval: 30 },
);

describe('…', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(WORKBOOK, SHEET);
    compareInputsAndOutputs(extract(sheet, 11, '1'), myCalculator);
  });
});
```

Extract `WORKBOOK` and `SHEET` constants when creating a new test so `dump:sheet` flags stay obvious.

## Sheep manure 4.4 (`columns.ts`)

| Export | Column | Role |
|--------|--------|------|
| `columnState` | B | State |
| `columnHead` | H | Head count |
| `columnGreasyWoolProduction` | BA | Greasy wool |
| `columnCleanWoolYieldProportion` | BB | Clean yield |
| `columnOutputEN2ODir` | BT | Soil direct N2O output |
| … | … | See `columns.ts` for full map |

Intermediate columns (e.g. MPjk, EBGjk, NRjk) are often on the sheet between inputs and BT; discover via `--range` / `--formula` dumps.

## Scenario row layout (4.4 sheep)

- One class block spans 4 rows (spring/summer/autumn/winter) per offset.
- `readSheepClassWithLambing(0)` → breeding ewes at rows `firstRow + 0..3`.
- Seasonal test `firstRow: 11`, `rowInterval: 30` → next flock scenario at row 41.

## Unit note for assertions

`compareInputsAndOutputs` compares `actual.unit.value.div(1000)` to the sheet cell. Mass-like calculator results are stored in **kg** internally; spreadsheet expectations for module totals are typically in **tonnes**.
