import { States } from '@/constants/enums';
import { input } from '@/tools/inputs';
import { hectaresToSquareMetres } from '@/tools/unit-conversion';
import { area, realNumber } from '@/tools/units';
import { DESCRIPTIONS } from '@/types/descriptions.schema';
import { object, proportion } from '@/types/schemas';
import { z } from 'zod';

export const BaseGrainsCropSchema = object({
  state: z.enum(States).meta({ description: DESCRIPTIONS.STATE }),
  areaSown: z
    .number()
    .gt(0)
    .transform((val) => input('areaSown', area(hectaresToSquareMetres(val))))
    .meta({ description: 'Area sown, in ha (hectares)' }),
  // NOTE: See Chapter 1 section 1.8.2 on leaching zones
  isInLeachingZone: z.boolean().meta({
    description: 'Whether the property is within a leaching zone',
  }),
  electricityAllocation: proportion(
    'Percentage of electricity use to allocate to this crop, from 0 to 1',
  ).transform((val) => input('electricityAllocation', realNumber(val))),
});

export type BaseGrainsCrop = z.input<typeof BaseGrainsCropSchema>;
export type BaseGrainsCropTransformed = z.output<typeof BaseGrainsCropSchema>;
