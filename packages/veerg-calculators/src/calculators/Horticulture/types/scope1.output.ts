import { GrainsScope1OutputSchemaWithoutRefrigerants } from '@/calculators/Grains/types/scope1.output';
import { LULUCFOutputSchema } from '@/modules/lulucf/output';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const HorticultureScope1OutputSchema =
  GrainsScope1OutputSchemaWithoutRefrigerants;

export type HorticultureScope1Output = z.infer<
  typeof HorticultureScope1OutputSchema
>;

export const HorticultureScope1OutputSchemaPlusLULUCF =
  GrainsScope1OutputSchemaWithoutRefrigerants.extend(
    LULUCFOutputSchema.shape,
  ).meta({
    id: 'HorticultureScope1OutputPlusLULUCF',
    description: OUTPUTDESCRIPTIONS.scope1,
  });

export type HorticultureScope1OutputPlusLULUCF = z.infer<
  typeof HorticultureScope1OutputSchemaPlusLULUCF
>;
