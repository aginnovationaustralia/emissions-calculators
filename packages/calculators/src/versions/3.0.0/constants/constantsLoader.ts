/* eslint-disable camelcase */
import { merge } from 'ts-deepmerge';
import { constants } from './constant_values';
import { ConstantsContext } from './context';
import { Constants } from './versionedConstants';

export function loadConstants(): Constants {
  return constants;
}

export function loadOverrideConstants(): Constants {
  const overrides = ConstantsContext.getOverrides();
  return merge<Constants[]>(loadConstants(), overrides as Constants);
}
