import { entriesFromObject } from '@/calculators/common/tools/object';
import { loadConstants } from '@/constants/loader';
import { AllConstants } from '@/constants/types';
import XLSX from 'xlsx-populate';
import { ExecutionContext } from '../../calculators/executionContext';
import { numberInput } from './sheets';

export const testContext = (
  calculator: string = 'testcalculator',
  workbook?: XLSX.Workbook,
): ExecutionContext<AllConstants> => {
  const constants = loadConstants();
  const checkpoint = workbook
    ? (
        sheetName: string,
        data: Record<string, { cell: string; value: number }>,
      ) => {
        if (workbook) {
          const sheet = workbook.sheet(sheetName);
          if (!sheet) {
            console.log(`❌ Checkpoint sheet not found: '${name}'`);
            return;
          }
          entriesFromObject(data).forEach(([name, { cell, value }]) => {
            const expectedValue = numberInput(sheet.cell(cell));
            if (expectedValue.toFixed(8) !== value.toFixed(8)) {
              console.log(
                `❌ Checkpoint failed: ${sheetName}(${cell}) -> sheet has ${expectedValue}, calculated ${value} for ${name}`,
              );
            } else {
              // console.log(
              //   `✅ Checkpoint passed: '${name}' ${cell} (${expectedValue})`,
              // );
            }
          });
        }
      }
    : undefined;
  return {
    calculator,
    version: global.CURRENT_VERSION,
    constants,
    timestamp: '2000-01-01T00:00:00Z',
    checkpoint,
  };
};
