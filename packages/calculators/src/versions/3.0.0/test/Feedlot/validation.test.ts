import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { InputValidationError } from '../../../..';
import { validateCalculatorInput } from '../../calculators';
import { FeedlotInput } from '../../types/Feedlot/input';
import { feedlotTestData } from './feedlot.data';

describe('validating Feedlot test inputs, all types of inputs', () => {
  const t = () => validateCalculatorInput(FeedlotInput, feedlotTestData);

  test('validation should result in no errors', () => {
    expect(t).not.toThrow();
    expect(t).not.toThrowError(InputValidationError);
    expect(t()).toBeInstanceOf(FeedlotInput);
  });
});

describe('validating Feedlot test inputs for incorrect inputs', () => {
  const classedInput = plainToClass(FeedlotInput, {
    ...feedlotTestData,
    state: 'vic2',
  });
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

describe('validating Feedlot purchase transformation', () => {
  const feedlot = feedlotTestData.feedlots[0];
  const feedlotDataWithSinglePurchase = {
    ...feedlotTestData,
    feedlots: [
      {
        ...feedlot,
        purchases: {
          ...feedlot.purchases,
          bullsGt1: feedlot.purchases.bullsGt1![0],
        },
      },
    ],
  } as unknown as FeedlotInput;

  const classedInput = plainToClass(
    FeedlotInput,
    feedlotDataWithSinglePurchase,
  );

  test('purchase should be an array', () => {
    expect(
      Array.isArray(
        feedlotDataWithSinglePurchase.feedlots[0].purchases.bullsGt1![0],
      ),
    ).toEqual(false);
    expect(Array.isArray(classedInput.feedlots[0].purchases.bullsGt1)).toEqual(
      true,
    );
    expect(classedInput.feedlots[0].purchases.bullsGt1!).toHaveLength(1);
  });
});
