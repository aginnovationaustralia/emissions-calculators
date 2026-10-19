import { WildCatchFisheriesScope1OutputSchema } from '@/calculators/WildCatchFisheries/types';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const AquacultureScope1OutputSchema =
  WildCatchFisheriesScope1OutputSchema.safeExtend({
    aquaticN2O: outputKey(OUTPUTDESCRIPTIONS.aquaticN2O),
  }).meta({ description: OUTPUTDESCRIPTIONS.scope1 });

export type AquacultureScope1Output = z.infer<
  typeof AquacultureScope1OutputSchema
>;
