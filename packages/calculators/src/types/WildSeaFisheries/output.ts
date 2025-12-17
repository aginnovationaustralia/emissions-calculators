import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { PurchasedOffsetsOutputSchema } from '../purchasedOffsets.output';
import { emissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { WildSeaFisheriesIntensitiesOutputSchema } from './intensities.output';
import { WildSeaFisheriesIntermediateOutputSchema } from './intermediate.output';
import { WildSeaFisheriesScope1OutputSchema } from './scope1.output';
import { WildSeaFisheriesScope3OutputSchema } from './scope3.output';

export const WildSeaFisheriesOutputSchema = emissionsOutput(
  'WildSeaFisheries',
  {
    scope1: WildSeaFisheriesScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: WildSeaFisheriesScope3OutputSchema,
    purchasedOffsets: PurchasedOffsetsOutputSchema,
    intermediate: z.array(WildSeaFisheriesIntermediateOutputSchema),
    net: NetOutputSchema,
    intensities: z.array(WildSeaFisheriesIntensitiesOutputSchema).meta({
      description:
        'Emissions intensity for each enterprise (in order), in t-CO2e/t product caught',
    }),
  },
);

export type WildSeaFisheriesOutput = z.infer<
  typeof WildSeaFisheriesOutputSchema
>;
