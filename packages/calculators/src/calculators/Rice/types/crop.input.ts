import { BaseCroppingActivityInputSchema } from '@/calculators/types/cropping-activity.input';
import { RiceProductionSystems } from '@/constants/enums';
import { InorganicFertilisersScope1Method1InputSchema } from '@/modules/scope1/5-fertiliser/inorganic-fertilisers.input';
import { OrganicFertilisersInputSchema } from '@/modules/scope1/5-fertiliser/organic-fertilisers.input';
import { HasRiceCultivationInputSchema } from '@/modules/scope1/7-rice-cultivation/rice-cultivation.input';
import { enumInput } from '@/tools/inputs';
import { FERT_INORGANIC_5_1 } from '@/tools/modules';
import { object } from '@/types/schemas';
import z from 'zod';

const RiceFertiliserInputSchema = object({
  productionSystem: enumInput(RiceProductionSystems, {
    name: 'Rice production system',
    description: 'Production system of the rice crop',
    method: '1',
    modules: [FERT_INORGANIC_5_1],
  }),
  inorganic: InorganicFertilisersScope1Method1InputSchema,
  organic: OrganicFertilisersInputSchema,
});

export const RiceCropInputSchema = BaseCroppingActivityInputSchema.safeExtend({
  ...HasRiceCultivationInputSchema.shape,
  fertiliser: RiceFertiliserInputSchema,
});

export type RiceCropInput = z.input<typeof RiceCropInputSchema>;
export type RiceCropInputTransformed = z.output<typeof RiceCropInputSchema>;
