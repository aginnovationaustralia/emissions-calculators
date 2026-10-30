import { BaseCroppingActivityInputSchema } from '@/calculators/types/cropping-activity.input';
import {
  InorganicFertilisersScope1Method1InputSchema,
  InorganicFertilisersScope1Method2InputSchema,
} from '@/modules/scope1/5-fertiliser/inorganic-fertilisers.input';
import { OrganicFertilisersInputSchema } from '@/modules/scope1/5-fertiliser/organic-fertilisers.input';
import { BaseCropResidueInputSchema } from '@/modules/scope1/6-residue-mgmt/crop-residue.input';
import {
  input,
  InputContainer,
  isProportion,
  numberInput,
} from '@/tools/inputs';
import {
  FERT_INORGANIC_5_1,
  INTENSITIES,
  RESIDUE_BURN_6_4,
  RESIDUE_CROPS_6_1,
  RESIDUE_LEACH_6_3,
} from '@/tools/modules';
import { mass, realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';

/**
 * The only relevant production system is 'Cotton', so it doesn't need to be provided by
 * the user if the cotton calculator is explicitly being used.
 */
const CottonFertiliserInputBaseSchema = object({
  organic: OrganicFertilisersInputSchema,
});

const CottonFertiliserInputWithMethod1InorganicInputSchema =
  CottonFertiliserInputBaseSchema.safeExtend({
    inorganic: InorganicFertilisersScope1Method1InputSchema,
  }).meta({ title: 'Inorganic fertiliser (scope 1 method 1)' });
type CottonFertiliserInputWithMethod1InorganicInput = z.input<
  typeof CottonFertiliserInputWithMethod1InorganicInputSchema
>;
type CottonFertiliserInputWithMethod1InorganicInputTransformed = z.output<
  typeof CottonFertiliserInputWithMethod1InorganicInputSchema
>;

const CottonFertiliserInputWithMethod2InorganicInputSchema =
  CottonFertiliserInputBaseSchema.safeExtend({
    inorganic: InorganicFertilisersScope1Method2InputSchema,
  }).meta({ title: 'Inorganic fertiliser (scope 1 method 2)' });
type CottonFertiliserInputWithMethod2InorganicInput = z.input<
  typeof CottonFertiliserInputWithMethod2InorganicInputSchema
>;
type CottonFertiliserInputWithMethod2InorganicInputTransformed = z.output<
  typeof CottonFertiliserInputWithMethod2InorganicInputSchema
>;

type CottonFertiliserInput =
  | CottonFertiliserInputWithMethod1InorganicInput
  | CottonFertiliserInputWithMethod2InorganicInput;

type CottonFertiliserInputTransformed = (
  | CottonFertiliserInputWithMethod1InorganicInputTransformed
  | CottonFertiliserInputWithMethod2InorganicInputTransformed
) & {
  productionSystem: InputContainer<'Cotton'>;
};

const CottonFertiliserInputSchema: z.ZodType<
  CottonFertiliserInputTransformed,
  CottonFertiliserInput
> = z
  .xor([
    CottonFertiliserInputWithMethod1InorganicInputSchema,
    CottonFertiliserInputWithMethod2InorganicInputSchema,
  ])
  .transform((val) => ({
    ...val,
    productionSystem: input('Cotton' as const, {
      name: 'Cotton',
      modules: [FERT_INORGANIC_5_1],
    }),
  }));

export const CottonCropResidueInputSchema = BaseCropResidueInputSchema.omit({
  totalYieldKg: true,
})
  .safeExtend({
    fractionSeedCottonLint: numberInput(
      realNumber,
      {
        name: 'Fraction of harvested crop that is cotton lint (not cotton seed)',
        description:
          'Fraction of the harvested cotton crop that is lint, as opposed to cotton seed.',
        modules: [INTENSITIES],
      },
      isProportion,
    ),
    totalYieldKg: numberInput(
      (val) => mass('DryMatter', val),
      {
        name: 'Pc',
        method: '1',
        description:
          'Total yield of the cotton crop, as dry matter. For accurate cotton intensity values, this value must exclude the total mass of trash',
        modules: [
          RESIDUE_CROPS_6_1,
          RESIDUE_LEACH_6_3,
          RESIDUE_BURN_6_4,
          INTENSITIES,
        ],
      },
      (s) => s.min(0),
    ),
  })
  .transform((val) => ({
    ...val,
    type: input('Cotton' as const, {
      name: 'Cotton',
      modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
    }),
  }));

export type CottonCropResidueInput = z.input<
  typeof CottonCropResidueInputSchema
>;

export const CottonCropInputSchema = BaseCroppingActivityInputSchema.safeExtend(
  {
    crop: CottonCropResidueInputSchema,
    fertiliser: CottonFertiliserInputSchema,
  },
);

export type CottonCropInput = z.input<typeof CottonCropInputSchema>;
export type CottonCropInputTransformed = z.output<typeof CottonCropInputSchema>;
