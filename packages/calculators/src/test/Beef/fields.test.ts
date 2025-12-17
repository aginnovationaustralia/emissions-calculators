import { BeefInputSchema } from '@/types/Beef/input';
import { validateCalculatorInput } from '../../calculators/validate';
import { beefTestData } from './input.data';
import { veg1, veg2 } from './vegetation.data';

describe('checking beef inputs and outputs', () => {
  const sb = beefTestData;
  const input = validateCalculatorInput(BeefInputSchema, sb);

  test('top-level input fields', () => {
    const inputFields = [
      'state',
      'northOfTropicOfCapricorn',
      'rainfallAbove600',
      'beef',
      'burning',
      'vegetation',
    ];

    if (!input.valid) {
      throw new Error(JSON.stringify(input.issues));
    }

    inputFields.forEach((f) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(input.result[f]).toBeDefined();
    });
  });
});

describe('vegetation', () => {
  const migratedVeg2 = {
    ...veg2,
    beefProportion: undefined,
  };

  const sb = {
    ...beefTestData,
    vegetation: [veg1, migratedVeg2],
  };

  test('check optional status of allocationToBeef', () => {
    const vegNoAllocation = {
      ...veg2,
      beefProportion: undefined,
      allocationToBeef: undefined,
    };

    expect(
      validateCalculatorInput(BeefInputSchema, {
        ...sb,
        vegetation: [veg1, vegNoAllocation],
      }),
    ).toEqual(
      expect.objectContaining({
        valid: false,
        issues: expect.any(Array),
      }),
    );
  });
});
