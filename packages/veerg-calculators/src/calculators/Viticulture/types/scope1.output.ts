import { GrainsScope1OutputSchemaWithoutRefrigerants } from '@/calculators/Grains/types/scope1.output';
import { LULUCFOutputSchema } from '@/modules/lulucf/output';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const ViticultureScope1OutputSchema =
  GrainsScope1OutputSchemaWithoutRefrigerants;

export type ViticultureScope1Output = z.infer<
  typeof ViticultureScope1OutputSchema
>;

export const ViticultureScope1OutputSchemaPlusLULUCF =
  GrainsScope1OutputSchemaWithoutRefrigerants.extend(
    LULUCFOutputSchema.shape,
  ).meta({
    id: 'ViticultureScope1OutputPlusLULUCF',
    description: OUTPUTDESCRIPTIONS.scope1,
  });

export type ViticultureScope1OutputPlusLULUCF = z.infer<
  typeof ViticultureScope1OutputSchemaPlusLULUCF
>;
