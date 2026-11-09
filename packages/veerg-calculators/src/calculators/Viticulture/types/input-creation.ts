import type { Prop } from '../../types/input-creation/type-helpers';
import type { ViticultureCropInput } from './crop.input';

export type {
  ViticultureCropInput,
  ViticultureCropResidueInput,
} from './crop.input';
export type ViticultureFertiliserInput = Prop<
  ViticultureCropInput,
  'fertiliser'
>;
