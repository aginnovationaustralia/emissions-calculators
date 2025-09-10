/* eslint-disable camelcase */
import { merge } from 'ts-deepmerge';
import { constants } from './constant_values';
import { Constants } from './versionedConstants';

export function loadConstants(): Constants {
  return constants;
}

export function loadOverrideConstants(overrides: object = {}): Constants {
  return merge(loadConstants(), overrides) as Constants;
}
