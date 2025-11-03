import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { DESCRIPTIONS, OUTPUTDESCRIPTIONS } from '../descriptions.schema';
import { PurchasedOffsetsOutputSchema } from '../purchasedOffsets.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { WildSeaFisheriesIntensitiesOutputSchema } from './intensities.output';
import { WildSeaFisheriesScope1OutputSchema } from './scope1.output';
import { WildSeaFisheriesScope3OutputSchema } from './scope3.output';

export const WildSeaFisheriesIntermediateOutputSchema =
  intermediateEmissionsOutput('WildSeaFisheries', {
    id: z.string().meta({ description: DESCRIPTIONS.ACTIVITY_ID }),
    scope1: WildSeaFisheriesScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: WildSeaFisheriesScope3OutputSchema,
    purchasedOffsets: PurchasedOffsetsOutputSchema,
    carbonSequestration: z
      .number()
      .meta({ description: OUTPUTDESCRIPTIONS.sequestration }),
    intensities: WildSeaFisheriesIntensitiesOutputSchema,
    net: NetOutputSchema,
  });

export type WildSeaFisheriesIntermediateOutput = z.infer<
  typeof WildSeaFisheriesIntermediateOutputSchema
>;
