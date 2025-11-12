import { z } from 'zod';
import { NetOutputSchema } from '../common/net.output';
import { intermediateEmissionsOutput } from '../schemas';
import { Scope2OutputSchema } from '../scope2.output';
import { PoultryEmissionsIntensitiesLayerSchema } from './intensities-layer.output';
import { PoultryScope1OutputSchema } from './scope1.output';
import { PoultryScope3OutputSchema } from './scope3.output';

export const PoultryIntermediateLayersOutputSchema =
  intermediateEmissionsOutput('Poultry (layers)', {
    scope1: PoultryScope1OutputSchema,
    scope2: Scope2OutputSchema,
    scope3: PoultryScope3OutputSchema,
    intensities: PoultryEmissionsIntensitiesLayerSchema,
    net: NetOutputSchema,
  });

export type PoultryIntermediateLayersOutput = z.infer<
  typeof PoultryIntermediateLayersOutputSchema
>;
