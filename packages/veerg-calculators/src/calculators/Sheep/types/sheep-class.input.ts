import {
  SheepClassExtendedMonthlyInput,
  SheepClassExtendedMonthlyInputTransformed,
  SheepClassWithLambingMonthlyInput,
  SheepClassWithLambingMonthlyInputTransformed,
  SheepClassWithProportionLambsBornMonthlyInput,
  SheepClassWithProportionLambsBornMonthlyInputTransformed,
} from './sheep-class-monthly.input';
import {
  SheepClassExtendedSeasonalInput,
  SheepClassExtendedSeasonalInputTransformed,
  SheepClassWithLambingSeasonalInput,
  SheepClassWithLambingSeasonalInputTransformed,
  SheepClassWithProportionLambsBornSeasonalInput,
  SheepClassWithProportionLambsBornSeasonalInputTransformed,
} from './sheep-class-seasonal.input';

export type SheepClassInput =
  SheepClassExtendedMonthlyInput | SheepClassExtendedSeasonalInput;

export type SheepClassInputTransformed =
  | SheepClassExtendedMonthlyInputTransformed
  | SheepClassExtendedSeasonalInputTransformed;

export const isSheepClassSeasonal = (
  cls: SheepClassInputTransformed,
): cls is SheepClassExtendedSeasonalInputTransformed => {
  return 'spring' in cls;
};

export type SheepClassWithLambingInput =
  SheepClassWithLambingMonthlyInput | SheepClassWithLambingSeasonalInput;
export type SheepClassWithLambingInputTransformed =
  | SheepClassWithLambingMonthlyInputTransformed
  | SheepClassWithLambingSeasonalInputTransformed;

export type SheepClassWithProportionLambsBornInput =
  | SheepClassWithProportionLambsBornMonthlyInput
  | SheepClassWithProportionLambsBornSeasonalInput;
export type SheepClassWithProportionLambsBornInputTransformed =
  | SheepClassWithProportionLambsBornMonthlyInputTransformed
  | SheepClassWithProportionLambsBornSeasonalInputTransformed;
