import type { Prop } from '../../types/input-creation/type-helpers';
import type { CottonCropInput } from './crop.input';

export type { CottonCropInput, CottonCropResidueInput } from './crop.input';
export type CottonFertiliserInput = Prop<CottonCropInput, 'fertiliser'>;
export type CottonFertiliserInputInorganicScope1Method1 = Extract<
  CottonFertiliserInput,
  { inorganic: { calculationMethodScope1: '1' } }
>;
export type CottonFertiliserInputInorganicScope1Method2 = Extract<
  CottonFertiliserInput,
  { inorganic: { calculationMethodScope1: '2' } }
>;
