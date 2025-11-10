import { BeefInputSchema } from '@/types/Beef/input';
import { validateCalculatorInput } from '../../calculators/calculators';
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

    inputFields.forEach((f) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      expect(input[f]).toBeDefined();
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

  test('vegetation beefProportion is not required', () => {
    const input = validateCalculatorInput(BeefInputSchema, sb);
    expect(input.vegetation[1].beefProportion).toBeUndefined();
  });

  test('check optional status of allocationToBeef', () => {
    const vegNoAllocation = {
      ...veg2,
      beefProportion: undefined,
      allocationToBeef: undefined,
    };

    expect(() =>
      validateCalculatorInput(BeefInputSchema, {
        ...sb,
        vegetation: [veg1, vegNoAllocation],
      }),
    ).toThrow();
  });
});
