import { CropTypes, PastureTypes } from '@/constants/enums';
import { selectConstant } from '@/tools/constants';
import { Container } from '@/tools/containers';
import { enumInput, isProportion, numberInput } from '@/tools/inputs';
import {
  RESIDUE_BURN_6_4,
  RESIDUE_CROPS_6_1,
  RESIDUE_LEACH_6_3,
  RESIDUE_PASTURE_6_2,
} from '@/tools/modules';
import { captureMethod1Or2Value } from '@/tools/multi';
import {
  hectaresToSquareMetres,
  tonnesPerHectareToKgPerSquareMetres,
} from '@/tools/unit-conversion';
import { area, mass, Mass, massPerArea, realNumber } from '@/tools/units';
import { object } from '@/types/schemas';
import { z } from 'zod';
import { HasCropConstants } from './constants';

const ResiduesMethod1Schema = object({
  calculationMethod: z.literal('1'),
}).meta({ title: 'Method 1' });

const ResiduesMethod2ByMassSchema = object({
  calculationMethod: z.literal('2'),
  massCropResidueRemoved: numberInput(
    (val) => mass('CropResidue', val),
    {
      name: 'Mremoved',
      method: '2',
      description: 'Mass of crop residue that is removed.',
      modules: [RESIDUE_CROPS_6_1],
    },
    (s) => s.min(0),
  ),
}).meta({ title: 'Method 2 (by mass)' });

const ResiduesMethod2ByFractionSchema = object({
  calculationMethod: z.literal('2'),
  fractionCropResidueRemoved: numberInput(
    (val) => realNumber(val),
    {
      name: 'fractionCropResidueRemoved',
      method: '2',
      description: 'Fraction of crop residue that is removed, from 0 to 1.',
      modules: [RESIDUE_CROPS_6_1],
    },
    isProportion,
  ),
}).meta({ title: 'Method 2 (by fraction)' });

export const BaseCropResidueInputSchema = object({
  totalYieldKg: numberInput(
    (val) => mass('DryMatter', val),
    {
      name: 'Pc',
      method: '1',
      description: 'Total yield of the crop, as dry matter',
      modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
    },
    (s) => s.min(0),
  ),
  fractionOfAnnualCropBurnt: numberInput(
    (val) => realNumber(val),
    {
      name: 'fractionOfAnnualCropBurnt',
      method: '1',
      description:
        'Fraction of annual production of crop that is burnt, from 0 to 1',
      modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
    },
    isProportion,
  ),
  residues: z.xor([
    ResiduesMethod1Schema,
    ResiduesMethod2ByMassSchema,
    ResiduesMethod2ByFractionSchema,
  ]),
});

type ResiduesMethod1InputTransformed = z.output<typeof ResiduesMethod1Schema>;
type ResiduesMethod2ByMassInputTransformed = z.output<
  typeof ResiduesMethod2ByMassSchema
>;
type ResiduesMethod2ByFractionInputTransformed = z.output<
  typeof ResiduesMethod2ByFractionSchema
>;

type ResiduesInputTransformed =
  | ResiduesMethod1InputTransformed
  | ResiduesMethod2ByMassInputTransformed
  | ResiduesMethod2ByFractionInputTransformed;

export const residueIsByMass = (
  residues: ResiduesInputTransformed,
): residues is ResiduesMethod2ByMassInputTransformed => {
  return (
    residues.calculationMethod === '2' && 'massCropResidueRemoved' in residues
  );
};

export type BaseCropResidueInput = z.input<typeof BaseCropResidueInputSchema>;
export type BaseCropResidueInputTransformed = z.output<
  typeof BaseCropResidueInputSchema
>;

export const CropResidueInputSchema = BaseCropResidueInputSchema.extend({
  type: enumInput(CropTypes, {
    name: 'Crop type',
    description: 'Type of crop grown in this activity',
    modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
  }),
});

export type CropResidueInput = z.input<typeof CropResidueInputSchema>;
export type CropResidueInputTransformed = z.output<
  typeof CropResidueInputSchema
>;

export const HasCropResidueInputSchema = object({
  crop: CropResidueInputSchema,
});
export type HasCropResidueInput = z.input<typeof HasCropResidueInputSchema>;
export type HasCropResidueInputTransformed = z.output<
  typeof HasCropResidueInputSchema
>;

export const PastureResidueInputSchema = object({
  type: enumInput(PastureTypes, {
    name: 'Pasture type',
    description: 'Type of pasture managed in this activity',
    modules: [RESIDUE_PASTURE_6_2, RESIDUE_LEACH_6_3],
  }),
  areaManaged: numberInput(
    (val) => area(hectaresToSquareMetres(val)),
    {
      name: 'areaManaged',
      method: '1',
      description: 'Area managed',
      modules: [RESIDUE_PASTURE_6_2, RESIDUE_LEACH_6_3],
    },
    (s) => s.min(0),
  ),
  fractionOfAnnualCropBurnt: numberInput(
    (val) => realNumber(val),
    {
      name: 'fractionOfAnnualCropBurnt',
      method: '1',
      description:
        'Fraction of annual production of crop that is burnt, from 0 to 1',
      modules: [RESIDUE_CROPS_6_1, RESIDUE_LEACH_6_3, RESIDUE_BURN_6_4],
    },
    isProportion,
  ),
  residues: z.xor([
    object({
      calculationMethod: z.literal('1'),
    }).meta({ title: 'Method 1' }),
    object({
      calculationMethod: z.literal('2'),
      averageYieldPerHectare: numberInput(
        (val) =>
          massPerArea('DryMatter', tonnesPerHectareToKgPerSquareMetres(val)),
        {
          name: 'averageYieldPerHectare',
          method: '2',
          description: 'Custom average pasture yield',
          modules: [RESIDUE_PASTURE_6_2],
        },
        (s) => s.min(0),
      ),
    }).meta({ title: 'Method 2' }),
  ]),
});

export type PastureResidueInput = z.input<typeof PastureResidueInputSchema>;
export type PastureResidueInputTransformed = z.output<
  typeof PastureResidueInputSchema
>;

export const HasPastureResidueInputSchema = object({
  pasture: PastureResidueInputSchema,
});
export type HasPastureResidueInput = z.input<
  typeof HasPastureResidueInputSchema
>;
export type HasPastureResidueInputTransformed = z.output<
  typeof HasPastureResidueInputSchema
>;

export const HasCropOrPastureResidueInputSchema = z.xor([
  HasCropResidueInputSchema.meta({ title: 'Crop' }),
  HasPastureResidueInputSchema.meta({ title: 'Pasture' }),
]);

export type HasCropOrPastureResidueInput = z.input<
  typeof HasCropOrPastureResidueInputSchema
>;
export type HasCropOrPastureResidueInputTransformed = z.output<
  typeof HasCropOrPastureResidueInputSchema
>;

export type t = HasCropResidueInputTransformed['crop'];

export const isCropResidueInput = (
  input: HasCropOrPastureResidueInputTransformed,
): input is HasCropResidueInputTransformed => {
  return 'crop' in input;
};
export const isPastureResidueInput = (
  input: HasCropOrPastureResidueInputTransformed,
): input is HasPastureResidueInputTransformed => {
  return 'pasture' in input;
};

export const getAverageYieldForPasture = (
  pasture: PastureResidueInputTransformed,
  constants: HasCropConstants,
) => {
  const defaultAverageYield = selectConstant(
    constants.CROP,
    'PASTURERESIDUE',
    pasture.type,
    'averageYield',
  );

  return captureMethod1Or2Value(
    defaultAverageYield,
    pasture.residues.calculationMethod === '2'
      ? pasture.residues.averageYieldPerHectare
      : undefined,
  );
};

export const getAmountProduced = (
  input: HasCropOrPastureResidueInputTransformed,
  constants: HasCropConstants,
): Container<Mass<'DryMatter'>> => {
  if (isCropResidueInput(input)) {
    return input.crop.totalYieldKg;
  }
  return getAverageYieldForPasture(input.pasture, constants).multiply(
    input.pasture.areaManaged,
  );
};
