import { getSheet } from '@/test/common/sheets';
import XLSX from 'xlsx-populate';
import { calculateScope3Services } from '../scope3/15.7-services';
import {
  ServicesInput,
  ServicesInputSchema,
  ServicesInputTransformed,
} from '../scope3/15.7-services/services.input';
import {
  checkServiceByAreaType,
  checkServiceByHourType,
} from './services-domain';
import {
  compareInputsAndOutputs,
  createSheetExtractor,
} from './sheet-comparison';

const getCalculatorInput = (
  sheet: XLSX.Sheet,
  row: number,
  method: '1' | '2',
): ServicesInputTransformed | undefined => {
  const cell = (column: string) =>
    sheet.cell(`${column}${row}`).value()?.toString();

  if (cell('A') === undefined) {
    return undefined;
  }

  const serviceType = cell('A');
  const amountPurchased = Number(cell('B'));

  // NOTE: Services has no method 2, it is being used to switch between area and time based services.
  const servicesInput: ServicesInput =
    method === '1'
      ? {
          services: [
            {
              serviceType: checkServiceByHourType(serviceType),
              serviceTimeHours: amountPurchased,
            },
          ],
        }
      : {
          services: [
            {
              serviceType: checkServiceByAreaType(serviceType),
              areaServicedHa: amountPurchased,
            },
          ],
        };

  return ServicesInputSchema.parse(servicesInput);
};

const extractInputsAndOutputs = createSheetExtractor(getCalculatorInput, 'E');

describe('15.7.1.1 Services', () => {
  it('time based services matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.7-services.xlsx',
      '15.7.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 5, '1');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3Services);
  });

  it('area based services matches spreadsheet results', async () => {
    const sheet = await getSheet(
      './src/modules/test/15.7-services.xlsx',
      '15.7.1.1',
    );

    const inputsAndOutputs = extractInputsAndOutputs(sheet, 8, '2');

    compareInputsAndOutputs(inputsAndOutputs, calculateScope3Services);
  });
});
