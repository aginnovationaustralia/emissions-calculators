import { input } from '@/tools/inputs';
import {
  hectaresToSquareMetres,
  tonnesPerHectareToKgPerSquareMetres,
} from '@/tools/unit-conversion';
import { area, massPerArea } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

export const LandUserChangeActivityInputSchema = object({
  carbonMassInTreesCurrentYear: z
    .number()
    .min(0)
    .meta({
      description:
        'Carbon mass per hectare in trees in current year. Derived from FullCAM output.',
    })
    .transform((val) =>
      input(
        'Ctijy',
        massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
      ),
    ),
  carbonMassInTreesPreviousYear: z
    .number()
    .min(0)
    .meta({
      description:
        'Carbon mass per hectare in trees in previous year. Derived from FullCAM output.',
    })
    .transform((val) =>
      input(
        'Ctijy-1',
        massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
      ),
    ),
  carbonMassInDebrisCurrentYear: z
    .number()
    .min(0)
    .meta({
      description:
        'Carbon mass per hectare in debris in current year. Derived from FullCAM output.',
    })
    .transform((val) =>
      input(
        'Cdijy',
        massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
      ),
    ),
  carbonMassInDebrisPreviousYear: z
    .number()
    .min(0)
    .meta({
      description:
        'Carbon mass per hectare in debris in previous year. Derived from FullCAM output.',
    })
    .transform((val) =>
      input(
        'Cdijy-1',
        massPerArea('Carbon', tonnesPerHectareToKgPerSquareMetres(val)),
      ),
    ),
  activityArea: z
    .number()
    .min(0)
    .meta({ description: 'Area of the activity' })
    .transform((val) =>
      input('ActivityArea', area(hectaresToSquareMetres(val))),
    ),
});

export type LandUserChangeActivityInput = z.input<
  typeof LandUserChangeActivityInputSchema
>;
export type LandUserChangeActivityInputTransformed = z.output<
  typeof LandUserChangeActivityInputSchema
>;
