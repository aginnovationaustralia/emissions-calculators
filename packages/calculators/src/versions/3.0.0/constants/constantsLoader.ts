import { merge } from 'ts-deepmerge';
import { CalculatorConfig } from '../execution/config';
import { constants } from './constant_values';
import { Constants } from './versionedConstants';

export function loadConstants(): Constants {
  return constants;
}

export function loadOverrideConstants(): Constants {
  const overrides = CalculatorConfig.overrides();
  return merge<Constants[]>(loadConstants(), overrides as Constants);
}
