import { commonConstants } from '@/constants/values';
import { getWorkbook } from '@/test/common/sheets';
import { Cell } from 'xlsx-populate';

// The workbooks in constants/ are the shared source of constants for the test workbooks,
// which reference their cells by defined name (e.g. common.xlsx!common_cch4). There is one
// workbook per section of values.ts, each with a sheet of the same name containing rows of:
// values.ts key | value | Excel defined name. See constants/README.md.
describe('constants workbooks', () => {
  const categories = { common: commonConstants };

  it.each(Object.entries(categories))(
    'matches values.ts for %s constants',
    async (category, constants) => {
      const workbook = await getWorkbook(
        `./src/modules/test/constants/${category}.xlsx`,
      );
      const sheet = workbook.sheet(category);

      let row = 2;
      while (sheet.cell(`A${row}`).value() !== undefined) {
        const key = String(sheet.cell(`A${row}`).value());
        const value = sheet.cell(`B${row}`).value();
        const excelName = String(sheet.cell(`C${row}`).value());

        expect(excelName).toMatch(new RegExp(`^${category}_`));
        const namedCell = workbook.definedName(excelName) as Cell | undefined;
        expect(namedCell?.address({ includeSheetName: true })).toEqual(
          `'${category}'!B${row}`,
        );

        const constant = constants[key as keyof typeof constants];
        if (typeof constant !== 'object' || !('store' in constant)) {
          throw new Error(
            `${key} in ${category}.xlsx is not a ${category} quantity constant`,
          );
        }
        expect({ key, value }).toEqual({
          key,
          value: constant.store.value.toNumber(),
        });
        row += 1;
      }
      expect(row).toBeGreaterThan(2);
    },
  );
});
