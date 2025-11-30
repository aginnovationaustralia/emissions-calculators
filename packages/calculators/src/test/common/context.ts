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
    ? (name: string, data: Record<string, { cell: string; value: number }>) => {
        // console.log(`Checkpoint: ${name}`);
        // console.dir(data, { depth: null });
        if (workbook) {
          const sheet = workbook.sheet(name);
          if (!sheet) {
            console.log(`❌ Checkpoint sheet not found: '${name}'`);
            return;
          }
          entriesFromObject(data).forEach(([name, { cell, value }]) => {
            const expectedValue = numberInput(sheet.cell(cell));
            if (expectedValue !== value) {
              console.log(
                `❌ Checkpoint failed: '${name}' ${cell} -> expected ${expectedValue}, actual ${value}`,
              );
            } else {
              console.log(
                `✅ Checkpoint passed: '${name}' ${cell} (${expectedValue})`,
              );
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
