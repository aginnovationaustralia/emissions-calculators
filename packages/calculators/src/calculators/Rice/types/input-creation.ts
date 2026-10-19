import type { HasRiceCultivationInput } from '@/modules/scope1/7-rice-cultivation/rice-cultivation.input';
import type { Prop } from '../../types/input-creation/type-helpers';
import type { RiceCropInput as RiceCropActivityInput } from './crop.input';

export type { RiceCultivationOrganicAmendmentInput } from '@/modules/scope1/7-rice-cultivation/organic-amendment.input';
export type { HasRiceCultivationInput } from '@/modules/scope1/7-rice-cultivation/rice-cultivation.input';
export type RiceCropInput = HasRiceCultivationInput['crop'];
export type RiceCropResiduesInput = RiceCropInput['residues'];

// The whole rice crop activity. `RiceCropInput` above is the rice cultivation `crop`
// within it, so the activity is exported under a different name.
export type { RiceCropInput as RiceCropActivityInput } from './crop.input';
export type RiceFertiliserInput = Prop<RiceCropActivityInput, 'fertiliser'>;
