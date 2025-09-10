import { Version } from '@/version';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { InputValidationError } from '../../../..';
import {
  calculateSheepBeefEmissions,
  validateCalculatorInput,
} from '../../calculators';
import { loadConstants } from '../../constants/constantsLoader';
import { SheepBeefInput } from '../../types/SheepBeef/input';
import { CustomisedFertiliser } from '../../types/types';
import { beefTestInput } from '../Beef/beef.data';
import { burnTestData } from '../Beef/burn.data';
import { V2_0_0 } from '../common/context';
import { sheepTestInput } from '../Sheep/sheep.data';
import { sheepbeefTestData } from './sheepbeef.data';

describe('validating SheepBeef test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(SheepBeefInput, sheepbeefTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(SheepBeefInput);
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

  const classedInput = plainToClass(SheepBeefInput, input);
  const errors = validateSync(classedInput);

  test('validation should result in 1 error', () => {
    expect(errors.length).toEqual(1);
  });

  test('validation error should contain message for state value', () => {
    expect(errors[0].constraints && errors[0].constraints.isEnum).toEqual(
      'state must be one of the following values: ',
    );
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

  const classedInput = plainToClass(SheepBeefInput, input);
  const errors = validateSync(classedInput);

  test('validation should result in 1 error', () => {
    expect(errors.length).toEqual(1);
  });

  // test('validation error should contain message for headPurchased value', () => {
  //   expect(errors[0].constraints && errors[0].constraints.isEnum).toEqual(
  //     'state must be one of the following values: ',
  //   );
  // });
});

describe('validating SheepBeef test inputs for incorrect nested inputs', () => {
  const constants = loadConstants();

  const executionContext = {
    calculator: 'sheepbeef',
    version: new Version(V2_0_0),
    constants,
    timestamp: '2021-08-17T00:00:00Z',
  };

  const input = {
    state: 'vic',
    northOfTropicOfCapricorn: false,
    rainfallAbove600: 'f',
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

  const t = () => {
    calculateSheepBeefEmissions(input, executionContext);
  };

  test('validation should throw ValidationError', () => {
    expect(t).toThrow(InputValidationError);
  });
});

describe('support for single sheep and beef instance', () => {
  const t = () =>
    validateCalculatorInput(SheepBeefInput, {
      ...sheepbeefTestData,
      beef: sheepbeefTestData.beef[0],
      sheep: sheepbeefTestData.sheep[0],
    });

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(SheepBeefInput);
    expect(t().sheep).toEqual([sheepbeefTestData.sheep[0]]);
    expect(t().beef).toEqual([sheepbeefTestData.beef[0]]);
  });
});

describe('accepts just one beef, no sheep', () => {
  const t = () =>
    validateCalculatorInput(SheepBeefInput, {
      ...sheepbeefTestData,
      beef: sheepbeefTestData.beef[0],
      sheep: [],
    });

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrow(InputValidationError);
    expect(t()).toBeInstanceOf(SheepBeefInput);
    expect(t().sheep).toEqual([]);
    expect(t().beef).toEqual([sheepbeefTestData.beef[0]]);
  });
});

describe('compatibility for migrated valid inputs', () => {
  describe('fertiliser.otherType', () => {
    test('old syntax for UAN is supported', () => {
      const fertiliser = { ...beefTestInput.fertiliser };
      fertiliser.otherType =
        ' Urea-Ammonium Nitrate (UAN)' as CustomisedFertiliser;
      const input = {
        state: 'vic',
        northOfTropicOfCapricorn: false,
        rainfallAbove600: true,
        beef: { ...beefTestInput, fertiliser },
        sheep: sheepTestInput,
        burning: burnTestData,
      };

      const classedInput = plainToClass(SheepBeefInput, input);
      const errors = validateSync(classedInput);
      expect(errors.length).toEqual(0);
      expect(classedInput?.beef[0]?.fertiliser?.otherType).toEqual(
        'Urea-Ammonium Nitrate (UAN)',
      );
    });

    test('old syntax for UAN is supported', () => {
      const fertiliser = { ...beefTestInput.fertiliser };
      fertiliser.otherType = 'Urea-Ammonium Nitrate (UAN)';

      const input = {
        state: 'vic',
        northOfTropicOfCapricorn: false,
        rainfallAbove600: true,
        beef: { ...beefTestInput, fertiliser },
        sheep: sheepTestInput,
        burning: burnTestData,
        vegetation: [],
      };

      const classedInput = plainToClass(SheepBeefInput, input);
      const errors = validateSync(classedInput);
      expect(errors).toHaveLength(0);
      expect(classedInput?.beef[0]?.fertiliser?.otherType).toEqual(
        'Urea-Ammonium Nitrate (UAN)',
      );
    });
  });

  describe('fertiliser.fertilisers.otherType', () => {
    test('old syntax for UAN is supported', () => {
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
        beef: { ...beefTestInput, fertiliser },
        sheep: sheepTestInput,
        burning: burnTestData,
        vegetation: [],
      };

      const classedInput = plainToClass(SheepBeefInput, input);
      const errors = validateSync(classedInput);
      expect(errors).toHaveLength(0);
      expect(
        classedInput?.beef[0]?.fertiliser?.otherFertilisers?.[0]?.otherType,
      ).toEqual('Urea-Ammonium Nitrate (UAN)');
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
        beef: { ...beefTestInput, fertiliser },
        sheep: sheepTestInput,
        burning: burnTestData,
        vegetation: [],
      };

      const classedInput = plainToClass(SheepBeefInput, input);
      const errors = validateSync(classedInput);
      expect(errors).toHaveLength(0);
      expect(
        classedInput?.beef[0]?.fertiliser?.otherFertilisers?.[0]?.otherType,
      ).toEqual('Urea-Ammonium Nitrate (UAN)');
    });
  });
});
