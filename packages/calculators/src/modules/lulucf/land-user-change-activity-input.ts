import { IBRA7Regions } from '@/constants/enums';
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
  ghgMassFromBiomassBurningPerHectare: z
    .number()
    .min(0)
    .meta({
      description:
        'GHG mass per hectare from biomass burning. Derived from FullCAM output.',
    })
    .transform((val) =>
      input(
        'Eg,i,j,y',
        massPerArea('CO2e', tonnesPerHectareToKgPerSqMetre(val)),
      ),
    ),
  region: z.enum(IBRA7Regions).meta({
    description: 'IBRA7 region of the activity area',
  }),
  areaBurnt: z
    .number()
    .min(0)
    .meta({
      description: 'Area burnt. Derived from FullCAM output.',
    })
    .transform((val) => input('ag,i,j,y', area(hectaresToSqMetres(val)))),
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
