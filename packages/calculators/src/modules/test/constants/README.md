# Shared constants for test workbooks

The test workbooks in `src/modules/test` used to type constants straight into their own cells (e.g. `=44/28`). The workbooks in this folder hold those constants in one place, with the same values as `src/constants/values.ts`. Test workbooks link to them, so a value is only defined once.

There is one workbook per section of `values.ts`, named after the section. Keeping sections in separate files means fewer merge conflicts, because a binary `.xlsx` can't be merged. Workbooks are added as they are needed:

| Workbook      | `values.ts` section | Contents                                                                                 |
| ------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| `common.xlsx` | `commonConstants`   | Elemental to molecular conversion factors (`ELEMENTAL_TO_MOLECULAR_CO2`, `_CH4`, `_N2O`) |

## Layout

Each workbook has a single sheet named after the section (e.g. `common`). Row 1 holds headers, and each row after it is one constant:

| Constant (A)                 | Value (B) | Excel name (C) |
| ---------------------------- | --------- | -------------- |
| `ELEMENTAL_TO_MOLECULAR_CH4` | 1.33      | `common_cch4`  |

- **Constant**: the key in `values.ts`.
- **Value**: the same value as `values.ts`. Enter it exactly as `values.ts` has it, e.g. `1.33` rather than `=16/12`.
- **Excel name**: a workbook-level defined name for the value cell (Formulas → Name Manager), prefixed with the section, e.g. `common_cch4`.

Names can't look like a cell reference. `cch4` on its own is column CCH, row 4, so always use the prefix.

`constants.test.ts` checks every row against `values.ts`, and checks that each name points at its row's value cell.

## Using a constant in a test workbook

1. Open the test workbook and the constants workbook in Excel.
2. In the cell that holds the constant, refer to the name rather than the cell, e.g. `=common.xlsx!common_cch4`. Excel stores the name, so rows in the constants workbook can move without breaking the link.
3. Point the rest of the workbook's formulas at that one cell.
4. Save. Excel stores the link as a relative path, e.g. `constants/common.xlsx`, or `../constants/common.xlsx` from a subfolder. Keep the folder layout the same, or the link breaks.

## Changing a constant

1. Update `values.ts` and the constants workbook together.
2. Open each test workbook that links to it, accept Excel's prompt to update links (or use Data → Edit Links → Update Values), and save.

The tests don't recalculate formulas. They read the values each workbook last saved, so a test workbook keeps using the old value until it has been refreshed and saved.

To find the test workbooks that use a name, search the spreadsheets for it, e.g. `common_cch4`.

## Adding a constant or a section

- **New constant**: add a row, then define its name over the value cell.
- **New section**: create `<section>.xlsx` with a sheet named `<section>`, using the layout above, and add the section to `categories` in `constants.test.ts`.

## Local file paths

Excel saves absolute paths from your machine inside `.xlsx` files, including a fallback path for every link. These are stripped automatically when you commit, by `scripts/strip-xlsx-paths.js` running as a pre-commit hook, and CI fails if any remain. To strip them by hand, run `node scripts/strip-xlsx-paths.js` from the repo root.
