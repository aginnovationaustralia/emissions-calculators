import { getSheet } from '@/test/common/sheets';
import { testContext } from '@/test/Grains/context';
import { collectIntermediates } from '@/tools/collect';
import { selectConstant } from '@/tools/constants';
import XLSX from 'xlsx-populate';
import { calculateManureManagementSoilDirectN2OForHerd } from '../../scope1/4-manure-management/4.2-beef-pasture/4.2-beef-pasture-manure-n2o';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from '../sheet-comparison';
import { columnExpectedEN2ODir, getCalculatorInput } from './common';

const getExpectedOutput = (sheet: XLSX.Sheet, row: number): number => {
  return Number(sheet.cell(`${columnExpectedEN2ODir}${row}`).value());
};

const extractInputsAndOutput = createSheetExtractor(
  getCalculatorInput,
  getExpectedOutput,
  { rowInterval: 50 },
);

describe('4.2. Beef Pasture Manure soil direct n2o seasonal', () => {
  it('method 1 scenarios match spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.2-beef.xlsx',
      '4.2.1',
    );

    const inputsAndOutputs = extractInputsAndOutput(sheet, 11, '1');

    compareInputsAndOutputs(
      inputsAndOutputs,
      calculateManureManagementSoilDirectN2OForHerd,
      '4.2',
    );
  });

  it('reports AE, the N excreted on pasture, as an intermediate', async () => {
    const sheet = await getSheet(
      './src/modules/test/4.2-beef-pasture/4.2-beef.xlsx',
      '4.2.1',
    );
    const { results } = extractInputsAndOutput(sheet, 11, '1');
    const context = testContext();

    for (const { input } of results) {
      const result = calculateManureManagementSoilDirectN2OForHerd(
        input,
        context,
      );
      const AE = collectIntermediates(result).filter(
        (i) => i.name === 'AE (herd)',
      );
      expect(AE).toHaveLength(1);

      // EN2O,dir = AE x EFPRP x Cg,N2O (4.2.1.3 (1))
      const { constants } = context;
      const EFPRP = selectConstant(
        constants.LIVESTOCK,
        'EF_DEPOSITED_URINE_AND_DUNG_PRP',
        input.climateZone,
      ).unit.store.value.toNumber();
      const cgN2O = selectConstant(
        constants.COMMON,
        'ELEMENTAL_TO_MOLECULAR_N2O',
      ).unit.store.value.toNumber();
      expect((AE[0].value as number) * EFPRP * cgN2O).toBeCloseTo(
        result.unit.store.value.toNumber(),
        6,
      );
    }
  });
});
