import { getSheet } from '@/test/common/sheets';
import { testContext } from '@/test/Grains/context';
import { collectIntermediates } from '@/tools/collect';
import { nv } from '@/tools/inputs';
import { sumByName } from '@/tools/outputs';
import XLSX from 'xlsx-populate';
import { calculateScope1RefrigerantUse } from '../scope1/9-refrigerant-use';
import { RefrigerantInput } from '../scope1/9-refrigerant-use/refrigerant.input';
import {
  RefrigerantsInputSchema,
  RefrigerantsInputTransformed,
} from '../scope1/9-refrigerant-use/refrigerants.input';
import {
  checkRefrigerantType,
  checkRefrigerationType,
} from './refrigeration-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
): RefrigerantsInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const refrigerant = checkRefrigerantType(cell('A'));
  const refrigerationType = checkRefrigerationType(cell('B'));
  const chargeSize = Number(cell('D'));

  const refrigerantInput: RefrigerantInput = {
    refrigerant,
    refrigerationType,
    chargeSizeKilograms: nv(chargeSize),
  };

  return RefrigerantsInputSchema.parse({ refrigerants: [refrigerantInput] });
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'G');

describe('9.1.1 Refrigerant use', () => {
  it('method 1 matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/9-refrigerant-use.xlsx',
      '9.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateScope1RefrigerantUse,
      '9.1',
    );
  });

  it('reports the CO2e of each refrigerant as an intermediate', () => {
    const input = RefrigerantsInputSchema.parse({
      refrigerants: [
        {
          refrigerant: 'R-404A',
          refrigerationType: 'Domestic refrigerators',
          chargeSizeKilograms: nv(10),
        },
        {
          refrigerant: 'HFC-134a (R-134a)',
          refrigerationType: 'Transport refrigeration',
          chargeSizeKilograms: nv(20),
        },
        {
          refrigerant: 'R-404A',
          refrigerationType: 'Transport refrigeration',
          chargeSizeKilograms: nv(5),
        },
      ],
    });

    const result = calculateScope1RefrigerantUse(input, testContext());
    const intermediates = sumByName(collectIntermediates(result));
    const co2e = (name: string) =>
      intermediates.find((i) => i.name === `ECO2e=${name}`)?.value as number;

    expect(co2e('R-404A')).toBeGreaterThan(0);
    expect(co2e('HFC-134a (R-134a)')).toBeGreaterThan(0);
    expect(co2e('R-404A') + co2e('HFC-134a (R-134a)')).toBeCloseTo(
      result.unit.store.value.toNumber(),
      8,
    );
  });
});
