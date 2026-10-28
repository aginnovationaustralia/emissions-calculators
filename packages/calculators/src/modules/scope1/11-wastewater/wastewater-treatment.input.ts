import {
  WastewaterCommodities,
  WastewaterFacilityType,
  WastewaterFacilityTypes,
} from '@/constants/enums';
import { enumSchema } from '@/tools/enum-schemas';
import { enumInput, input, isProportion, numberInput } from '@/tools/inputs';
import { WASTEWATER_11_1 } from '@/tools/modules';
import {
  cubicMetresToLitres,
  perCubicMetresToPerLitres,
  tonnesToKg,
} from '@/tools/unit-conversion';
import { massPerVolume, realNumber, volume } from '@/tools/units';
import { object } from '@/types/schemas';
import z from 'zod';

const BaseWastewaterTreatmentInputSchema = object({
  facilityType: enumSchema(WastewaterFacilityTypes)
    .meta({
      description: 'The type of facility the wastewater was treated at.',
    })
    .transform((val) =>
      input(val as WastewaterFacilityType, {
        name: 'wastewater treatment facility type',
        modules: [WASTEWATER_11_1],
      }),
    ),
  wastewaterVolume: numberInput(
    (val) => volume('FluidWaste', cubicMetresToLitres(val)),
    {
      name: 'Wt',
      method: '1',
      description: 'The volume of wastewater treated.',
      modules: [WASTEWATER_11_1],
    },
    (s) => s.min(0),
  ),
  fractionRemoved: numberInput(
    (val) => realNumber(val),
    {
      name: 'fraction COD removed',
      method: '1',
      description:
        'Fraction of COD removed from the wastewater treatment facility and transferred to landfill, biochar production, or other site. If unknown, can be conservatively assumed to be 0.',
      modules: [WASTEWATER_11_1],
    },
    isProportion,
  ),
});

const WastewaterTreatmentMethod1InputSchema =
  BaseWastewaterTreatmentInputSchema.safeExtend({
    commodityType: enumInput(WastewaterCommodities, {
      name: 'Commodity type (c)',
      description:
        'The type of commodity for which production has resulted in the wastewater being treated',
      method: '1',
      modules: [WASTEWATER_11_1],
    }),
  }).meta({
    title: 'Wastewater treatment - method 1',
  });
export type WastewaterTreatmentMethod1Input = z.input<
  typeof WastewaterTreatmentMethod1InputSchema
>;
export type WastewaterTreatmentMethod1InputTransformed = z.output<
  typeof WastewaterTreatmentMethod1InputSchema
>;

const WastewaterTreatmentMethod2InputSchema =
  BaseWastewaterTreatmentInputSchema.safeExtend({
    inletCOD: numberInput(
      (val) =>
        massPerVolume('COD', 'FluidWaste', perCubicMetresToPerLitres(val)),
      {
        name: 'CODin,c',
        method: '2',
        description: 'Average inlet COD concentration of wastewater',
        modules: [WASTEWATER_11_1],
      },
      (s) => s.min(0),
    ),
    outletCOD: numberInput(
      (val) =>
        massPerVolume('COD', 'FluidWaste', perCubicMetresToPerLitres(val)),
      {
        name: 'CODout',
        method: '2',
        description:
          'Average outlet COD concentration of wastewater. If not provided, it will be estimated based on inlet COD concentration.',
        modules: [WASTEWATER_11_1],
      },
      (s) => s.min(0),
    ),
    fractionSludge: numberInput(
      (val) => realNumber(val),
      {
        name: 'Fsludge',
        method: '2',
        description:
          'Fraction of COD removed from the wastewater treatment facility as sludge',
        modules: [WASTEWATER_11_1],
      },
      isProportion,
    ),

    methaneCaptured: numberInput(
      (val) => volume('CH4', tonnesToKg(val)),
      {
        name: 'Qcap',
        method: '2',
        description:
          'Quantity of methane in sludge biogas captured for combustion for the operation of the treatment facility',
        modules: [WASTEWATER_11_1],
      },
      (s) => s.min(0),
    ),
    methaneFlared: numberInput(
      (val) => volume('CH4', tonnesToKg(val)),
      {
        name: 'Qflared',
        method: '2',
        description:
          'Quantity of methane in sludge biogas flared by the treatment facility',
        modules: [WASTEWATER_11_1],
      },
      (s) => s.min(0),
    ),
    methaneOut: numberInput(
      (val) => volume('CH4', tonnesToKg(val)),
      {
        name: 'Qout',
        method: '1',
        description:
          'Quantity of methane in sludge biogas transferred out of the treatment facility',
        modules: [WASTEWATER_11_1],
      },
      (s) => s.min(0),
    ),
  })
    .superRefine(({ inletCOD, outletCOD }, context) => {
      if (outletCOD.unit.store.value.gt(inletCOD.unit.store.value)) {
        context.addIssue({
          code: 'custom',
          message:
            'Outlet COD concentration cannot exceed inlet COD concentration.',
          path: ['outletCOD'],
        });
      }
    })
    .meta({
      title: 'Wastewater treatment - method 2',
    });
export type WastewaterTreatmentMethod2Input = z.input<
  typeof WastewaterTreatmentMethod2InputSchema
>;
export type WastewaterTreatmentMethod2InputTransformed = z.output<
  typeof WastewaterTreatmentMethod2InputSchema
>;

export const WastewaterTreatmentInputSchema = z.xor([
  WastewaterTreatmentMethod1InputSchema,
  WastewaterTreatmentMethod2InputSchema,
]);
export type WastewaterTreatmentInput = z.input<
  typeof WastewaterTreatmentInputSchema
>;
export type WastewaterTreatmentInputTransformed = z.output<
  typeof WastewaterTreatmentInputSchema
>;

export const wastewaterInputIsMethod1 = (
  wastewater: WastewaterTreatmentInputTransformed,
): wastewater is WastewaterTreatmentMethod1InputTransformed => {
  return 'commodityType' in wastewater;
};

export const wastewaterInputIsMethod2 = (
  wastewater: WastewaterTreatmentInputTransformed,
): wastewater is WastewaterTreatmentMethod2InputTransformed => {
  return 'methaneCaptured' in wastewater;
};

export const HasWastewaterTreatmentInputSchema = object({
  wastewater: WastewaterTreatmentInputSchema.optional(),
});

export type HasWastewaterTreatmentInput = z.input<
  typeof HasWastewaterTreatmentInputSchema
>;
export type HasWastewaterTreatmentInputTransformed = z.output<
  typeof HasWastewaterTreatmentInputSchema
>;
