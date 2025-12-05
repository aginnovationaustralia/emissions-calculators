import { SheepBeefInputSchema } from '@/types/SheepBeef/input';
import { CustomisedFertiliser } from '@/types/enums';
import { InputValidationError } from '../..';
import { validateCalculatorInput } from '../../calculators/validate';
import { beefTestInput } from '../Beef/beef.data';
import { burnTestData } from '../Beef/burn.data';
import { sheepTestInput } from '../Sheep/sheep.data';
import { sheepbeefTestData } from './sheepbeef.data';

describe('validating SheepBeef test inputs, all types of inputs', () => {
  const t = () =>
    validateCalculatorInput(SheepBeefInputSchema, sheepbeefTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
  });
});

describe('validating SheepBeef test inputs for incorrect inputs', () => {
  const input = {
    state: 'vic2',
    northOfTropicOfCapricorn: false,
    rainfallAbove600: true,
    beef: beefTestInput,
    sheep: sheepTestInput,
    burning: burnTestData,
  };

  const result = SheepBeefInputSchema.safeParse(input);

  test('validation should result in 1 error', () => {
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('validation error should contain message for state value', () => {
    expect(result.success).toBe(false);
    if (!result.success) {
      const stateError = result.error.issues.find((issue) =>
        issue.path.includes('state'),
      );
      expect(stateError).toBeDefined();
    }
  });
});

describe('validating SheepBeef test inputs for incorrect nested inputs', () => {
  const input = {
    state: 'vic',
    northOfTropicOfCapricorn: false,
    rainfallAbove600: true,
    beef: {
      ...beefTestInput,
      classes: {
        ...beefTestInput.classes,
        bullsGt1: {
          ...beefTestInput.classes.bullsGt1,
          headPurchased: 's3rwe',
          autumn: 2,
        },
      },
    },
    sheep: sheepTestInput,
    burning: burnTestData,
  };

  const result = SheepBeefInputSchema.safeParse(input);

  test('validation should result in 1 error', () => {
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThanOrEqual(1);
    }
  });

  // test('validation error should contain message for headPurchased value', () => {
  //   expect(errors[0].constraints && errors[0].constraints.isEnum).toEqual(
  //     'state must be one of the following values: ',
  //   );
  // });
});

describe('a single sheep and beef instance is not supported', () => {
  const t = validateCalculatorInput(SheepBeefInputSchema, {
    ...sheepbeefTestData,
    beef: sheepbeefTestData.beef[0],
    sheep: sheepbeefTestData.sheep[0],
  });

  test('validation should result in no errors', () => {
    expect(t).toEqual(
      expect.objectContaining({
        valid: false,
        error: expect.any(InputValidationError),
      }),
    );
  });
});

describe('just one beef, no sheep is not supported', () => {
  const t = validateCalculatorInput(SheepBeefInputSchema, {
    ...sheepbeefTestData,
    beef: sheepbeefTestData.beef[0],
    sheep: [],
  });

  test('validation should result in no errors', () => {
    expect(t.valid).toBe(false);
  });
});

describe('compatibility for migrated valid inputs', () => {
  describe('fertiliser.fertilisers.otherType', () => {
    test('old syntax for UAN is not supported', () => {
      const fertiliser = { ...beefTestInput.fertiliser };
      fertiliser.otherFertilisers = [
        {
          otherType: ' Urea-Ammonium Nitrate (UAN)' as CustomisedFertiliser,
          otherDryland: 0,
          otherIrrigated: 0,
        },
      ];
      const input = {
        state: 'vic',
        northOfTropicOfCapricorn: false,
        rainfallAbove600: true,
        beef: [{ ...beefTestInput, fertiliser }],
        sheep: [sheepTestInput],
        burning: [burnTestData],
        vegetation: [],
      };

      const result = SheepBeefInputSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    test('new syntax for UAN is supported', () => {
      const fertiliser = { ...beefTestInput.fertiliser };
      fertiliser.otherFertilisers = [
        {
          otherType: 'Urea-Ammonium Nitrate (UAN)',
          otherDryland: 0,
          otherIrrigated: 0,
        },
      ];
      const input = {
        state: 'vic',
        northOfTropicOfCapricorn: false,
        rainfallAbove600: true,
        beef: [{ ...beefTestInput, fertiliser }],
        sheep: [sheepTestInput],
        burning: [burnTestData],
        vegetation: [],
      };

      const result = SheepBeefInputSchema.safeParse(input);
      console.log(result.error?.issues);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(
          result.data?.beef[0]?.fertiliser?.otherFertilisers?.[0]?.otherType,
        ).toEqual('Urea-Ammonium Nitrate (UAN)');
      }
    });
  });
});
