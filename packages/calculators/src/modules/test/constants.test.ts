import { commonConstants } from '@/constants/values';
import { getWorkbook } from '@/test/common/sheets';
import { Cell } from 'xlsx-populate';

// constants.xlsx is the shared source of constants for the test workbooks, which reference
// its cells by defined name (e.g. constants.xlsx!common_cch4). Each sheet is a constants
// category, with rows of: values.ts key | value | Excel defined name.
describe('constants.xlsx', () => {
  const categories = { common: commonConstants };

  it.each(Object.entries(categories))(
    'matches values.ts for %s constants',
    async (category, constants) => {
      const workbook = await getWorkbook('./src/modules/test/constants.xlsx');
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
            `${key} in constants.xlsx is not a ${category} quantity constant`,
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
