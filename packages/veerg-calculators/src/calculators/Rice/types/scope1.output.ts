import {
  GrainsScope1OutputSchema,
  GrainsScope1OutputSchemaPlusLULUCF,
} from '@/calculators/Grains/types';
import { outputKey } from '@/tools/zod';
import { OUTPUTDESCRIPTIONS } from '@/types/descriptions.schema';
import { z } from 'zod';

export const RiceScope1OutputSchema = GrainsScope1OutputSchema.safeExtend({
  riceCultivationCH4: outputKey(OUTPUTDESCRIPTIONS.riceCultivationCH4),
}).meta({ id: 'RiceScope1Output', description: OUTPUTDESCRIPTIONS.scope1 });

export type RiceScope1Output = z.infer<typeof RiceScope1OutputSchema>;

export const RiceScope1OutputSchemaPlusLULUCF =
  GrainsScope1OutputSchemaPlusLULUCF.safeExtend({
    riceCultivationCH4: outputKey(OUTPUTDESCRIPTIONS.riceCultivationCH4),
  }).meta({
    id: 'RiceScope1OutputPlusLULUCF',
    description: OUTPUTDESCRIPTIONS.scope1,
  });

export type RiceScope1OutputPlusLULUCF = z.infer<
  typeof RiceScope1OutputSchemaPlusLULUCF
>;
