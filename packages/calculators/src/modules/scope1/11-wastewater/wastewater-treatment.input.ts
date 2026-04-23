import {
  WastewaterFacilityType,
  WastewaterFacilityTypes,
} from '@/constants/enums';
import { input } from '@/tools/inputs';
import { perCubicMetresToPerLitres, tonnesToKg } from '@/tools/unit-conversion';
import { massPerVolume, realNumber, volume } from '@/tools/units';
import { object, proportion } from '@/types/schemas';
import z from 'zod';

export const WastewaterTreatmentInputSchema = object({
  facilityType: z
    .literal(WastewaterFacilityTypes)
    .meta({
      description: 'The type of facility the wastewater was treated at.',
    })
    .transform((val) =>
      input(
        'wastewater treatment facility type',
        val as WastewaterFacilityType,
      ),
    ),
  wastewaterVolume: z
    .number()
    .min(0)
    .meta({
      description: 'The volume of wastewater treated, in cubic metres (m^3).',
    })
    .transform((val) =>
      input('volume of wastewater', volume('FluidWaste', tonnesToKg(val))),
    ),
  inletCOD: z
    .number()
    .min(0)
    .meta({
      description: 'Average inlet COD concentration of wastewater (kg COD/m^3)',
    })
    .transform((val) =>
      input(
        'inlet COD',
        massPerVolume('COD', 'FluidWaste', perCubicMetresToPerLitres(val)),
      ),
    ),
  outletCOD: z
    .number()
    // REVISIT: Check if zod has a way to constrain this to be less than `inletCOD`
    .min(0)
    .meta({
      description:
        'Average outlet COD concentration of wastewater (kg COD/m^3)',
    })
    .transform((val) =>
      input(
        'outlet COD',
        massPerVolume('COD', 'FluidWaste', perCubicMetresToPerLitres(val)),
      ),
    ),
  /**
   * REVISIT(?):
   * From Question Reference 11.1 of the Tranche 2 draft guidelines (Chapter 11.1; line 150):
   * > *"Which parameters should be made default values in the Guidelines
   * > (where it would be otherwise unrealistic to expect entities with
   * > on-site wastewater treatment to know these values (e.g. Fsludge))?"*
   *
   * Check back when the guidelines are finalised in case we need to implement defaults here.
   */
  fractionSludge: proportion(
    'Fraction of COD removed from the wastewater treatment facility as sludge',
  ).transform((val) => input('fraction COD sludge', realNumber(val))),
  fractionRemoved: proportion(
    'Fraction of COD removed from the wastewater treatment facility and transferred to landfill, biochar production, or other sitefraction of COD removed from wastewater as sludge',
  ).transform((val) => input('fraction COD removed', realNumber(val))),
  methaneCaptured: z
    .number()
    .min(0)
    .meta({
      description:
        'Quantity of methane in sludge biogas captured for combustion for the operation of the treatment facility (m^3 CH4)',
    })
    // Converted from cubic meters to litres
    .transform((val) =>
      input('captured methane volume', volume('CH4', tonnesToKg(val))),
    ),
  methaneFlared: z
    .number()
    .min(0)
    .meta({
      description:
        'Quantity of methane in sludge biogas flared by the treatment facility (m^3 CH4)',
    })
    // Converted from cubic meters to litres
    .transform((val) =>
      input('flared methane volume', volume('CH4', tonnesToKg(val))),
    ),
  methaneOut: z
    .number()
    .min(0)
    .meta({
      description:
        'Quantity of methane in sludge biogas transferred out of the treatment facility (m^3 CH4)',
    })
    // Converted from cubic meters to litres
    .transform((val) =>
      input('transferred methane volume', volume('CH4', tonnesToKg(val))),
    ),
});

export type WastewaterTreatmentInput = z.input<
  typeof WastewaterTreatmentInputSchema
>;
export type WastewaterTreatmentInputTransformed = z.output<
  typeof WastewaterTreatmentInputSchema
>;
